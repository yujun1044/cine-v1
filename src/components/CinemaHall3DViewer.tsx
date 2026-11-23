import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  RotateCw,
  RotateCcw,
  Box,
  ChevronDown,
  ChevronUp,
  Film,
  Sparkles,
  Monitor,
} from 'lucide-react';
import screenHeroImg from '../assets/images/hero_cinematic_blockbuster_1794209491695.jpg';
import screenxSideImg from '../assets/images/screenx_panoramic_scene_1794209493353.jpg';

type CameraPreset = 'cutaway' | 'goldenSeat' | 'side' | 'top';
type HallMode = 'imax' | '4dx' | 'screenx';

interface CinemaHall3DViewerProps {
  brandName?: string;
}

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: THREE.Vector3; target: THREE.Vector3; label: string }
> = {
  cutaway: {
    pos: new THREE.Vector3(4.55, 3.35, 4.95),
    target: new THREE.Vector3(0, 1.05, -0.15),
    label: '전체 뷰',
  },
  goldenSeat: {
    pos: new THREE.Vector3(0, 1.46, 0.72),
    target: new THREE.Vector3(0, 1.38, -2.35),
    label: 'G열 시점',
  },
  side: {
    pos: new THREE.Vector3(5.85, 1.95, 0.2),
    target: new THREE.Vector3(0, 1.05, -0.1),
    label: '측면 단면',
  },
  top: {
    pos: new THREE.Vector3(0, 6.7, 1.35),
    target: new THREE.Vector3(0, 0.7, -0.15),
    label: '상단 평면',
  },
};

function createCurvedScreenGeometry(
  width: number,
  height: number,
  arcAngle: number,
  widthSegments = 40,
  heightSegments = 10
): THREE.PlaneGeometry {
  const geom = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
  const pos = geom.attributes.position;
  const radius = width / 2 / arcAngle;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const nx = x / (width / 2);
    const theta = nx * arcAngle;

    const curvedX = Math.sin(theta) * radius;
    const curvedZ = (1 - Math.cos(theta)) * radius;
    pos.setXYZ(i, curvedX, y, curvedZ);
  }

  pos.needsUpdate = true;
  geom.computeVertexNormals();
  return geom;
}

function createFallbackScreenTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 1024, 512);
    grad.addColorStop(0, '#181a24');
    grad.addColorStop(0.5, '#2b1b22');
    grad.addColorStop(1, '#14161e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    ctx.strokeStyle = 'rgba(194, 168, 120, 0.25)';
    ctx.lineWidth = 2;
    ctx.strokeRect(28, 28, 968, 456);

    ctx.fillStyle = '#EAECEF';
    ctx.font = 'bold 42px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('IMAX 4K DUAL LASER', 512, 245);
    ctx.fillStyle = '#C2A878';
    ctx.font = '20px monospace';
    ctx.fillText('1.90:1 EXPANDED RATIO · 64CH DOLBY ATMOS', 512, 290);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createBeamTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, 'rgba(234, 236, 239, 0.42)');
    grad.addColorStop(0.35, 'rgba(194, 168, 120, 0.14)');
    grad.addColorStop(1, 'rgba(194, 168, 120, 0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export const CinemaHall3DViewer: React.FC<CinemaHall3DViewerProps> = ({
  brandName = 'CINE V',
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const desiredCameraPosRef = useRef<THREE.Vector3 | null>(null);
  const desiredTargetRef = useRef<THREE.Vector3 | null>(null);
  const requestRenderRef = useRef<() => void>(() => {});
  const autoRotateRef = useRef<boolean>(true);
  const wireframeRef = useRef<boolean>(false);
  const hallModeRef = useRef<HallMode>('imax');
  const isSoftwareGlRef = useRef<boolean>(false);

  const wireableMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const sideScreenMatsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const sideScreenTexRef = useRef<THREE.Texture | null>(null);
  const beamMeshRef = useRef<THREE.Mesh | null>(null);
  const rowGroupsRef = useRef<THREE.Group[]>([]);

  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<CameraPreset>('cutaway');
  const [hallMode, setHallMode] = useState<HallMode>('imax');
  const [isHudExpanded, setIsHudExpanded] = useState<boolean>(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let disposed = false;
    let frameId: number | null = null;
    let softwareTimerId: number | null = null;
    let needsRender = true;
    let motionTime = 0;

    const width = Math.max(container.clientWidth, 300);
    const height = Math.max(container.clientHeight, 340);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });

    const gl = renderer.getContext();
    const debugInfo = gl.getExtension('WEBGL_DEBUG_RENDERER_INFO');
    const rendererString = debugInfo
      ? String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL))
      : '';
    const isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(
      rendererString
    );
    isSoftwareGlRef.current = isSoftwareGl;

    if (isSoftwareGl) {
      autoRotateRef.current = false;
      setAutoRotate(false);
    }

    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.outline = 'none';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#101114');

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRenderTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envRenderTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.copy(CAMERA_PRESETS.cutaway.pos);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(CAMERA_PRESETS.cutaway.target);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.enablePan = true;
    controls.minDistance = 0.85;
    controls.maxDistance = 12.5;
    controls.maxPolarAngle = Math.PI * 0.49;
    controls.autoRotate = !isSoftwareGl && autoRotateRef.current;
    controls.autoRotateSpeed = 0.85;
    controls.update();
    controlsRef.current = controls;

    // 3-Point Architectural Lighting
    const hemiLight = new THREE.HemisphereLight(0xeaecef, 0x16181f, 0.55);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e8, 1.55);
    keyLight.position.set(5.5, 7.5, 5.5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 22;
    keyLight.shadow.camera.left = -4.5;
    keyLight.shadow.camera.right = 4.5;
    keyLight.shadow.camera.top = 4.5;
    keyLight.shadow.camera.bottom = -4.5;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xc2a878, 0.65);
    rimLight.position.set(-5.5, 4.0, -4.5);
    scene.add(rimLight);

    // Soft screen bounce light illuminating the front seats
    const screenBounceLight = new THREE.PointLight(0xd9dce6, 1.4, 8, 1.6);
    screenBounceLight.position.set(0, 1.55, -1.65);
    scene.add(screenBounceLight);

    // Track disposable resources
    const geometriesToDispose: THREE.BufferGeometry[] = [];
    const materialsToDispose: THREE.Material[] = [];
    const texturesToDispose: THREE.Texture[] = [];
    const wireableMats: THREE.MeshStandardMaterial[] = [];

    const regGeo = <T extends THREE.BufferGeometry>(g: T): T => {
      geometriesToDispose.push(g);
      return g;
    };
    const regMat = <T extends THREE.Material>(m: T, wireable = true): T => {
      materialsToDispose.push(m);
      if (wireable && m instanceof THREE.MeshStandardMaterial) {
        wireableMats.push(m);
      }
      return m;
    };
    const regTex = <T extends THREE.Texture>(t: T): T => {
      texturesToDispose.push(t);
      return t;
    };

    // Shared Architectural Materials
    const plinthMat = regMat(
      new THREE.MeshStandardMaterial({
        color: 0x16181f,
        roughness: 0.85,
        metalness: 0.16,
      })
    );
    const floorCarpetMat = regMat(
      new THREE.MeshStandardMaterial({
        color: 0x12141a,
        roughness: 0.95,
        metalness: 0.04,
      })
    );
    const riserMat = regMat(
      new THREE.MeshStandardMaterial({
        color: 0x1c1f28,
        roughness: 0.88,
        metalness: 0.1,
      })
    );
    const goldTrimMat = regMat(
      new THREE.MeshStandardMaterial({
        color: 0xc2a878,
        roughness: 0.35,
        metalness: 0.65,
      })
    );
    const aisleLedMat = regMat(
      new THREE.MeshStandardMaterial({
        color: 0xc2a878,
        emissive: 0xc2a878,
        emissiveIntensity: 0.85,
        roughness: 0.3,
      }),
      false
    );
    const frameDarkMat = regMat(
      new THREE.MeshStandardMaterial({
        color: 0x0c0d11,
        roughness: 0.65,
        metalness: 0.35,
      })
    );
    const ribMat = regMat(
      new THREE.MeshStandardMaterial({
        color: 0x1e212b,
        roughness: 0.72,
        metalness: 0.25,
      })
    );
    const seatCrimsonMat = regMat(
      new THREE.MeshStandardMaterial({
        color: 0x7b1d26,
        roughness: 0.82,
        metalness: 0.05,
      })
    );
    const seatGoldenZoneMat = regMat(
      new THREE.MeshStandardMaterial({
        color: 0x9e202b,
        roughness: 0.74,
        metalness: 0.08,
      })
    );
    const seatBaseMetalMat = regMat(
      new THREE.MeshStandardMaterial({
        color: 0x242731,
        roughness: 0.45,
        metalness: 0.6,
      })
    );
    const projectorGlassMat = regMat(
      new THREE.MeshStandardMaterial({
        color: 0x1a1e28,
        roughness: 0.15,
        metalness: 0.85,
      })
    );
    const lensGlowMat = regMat(
      new THREE.MeshStandardMaterial({
        color: 0xeaecef,
        emissive: 0xd9c298,
        emissiveIntensity: 1.5,
        roughness: 0.2,
      }),
      false
    );

    const theaterGroup = new THREE.Group();
    scene.add(theaterGroup);

    // 1. Base Architectural Plinth & Recessed Floor
    const plinthMesh = new THREE.Mesh(
      regGeo(new THREE.BoxGeometry(5.5, 0.22, 6.2)),
      plinthMat
    );
    plinthMesh.position.set(0, 0.11, 0.1);
    plinthMesh.receiveShadow = !isSoftwareGl;
    theaterGroup.add(plinthMesh);

    const trimEdges = [
      { size: [5.54, 0.025, 0.03] as const, pos: [0, 0.22, -2.99] as const },
      { size: [5.54, 0.025, 0.03] as const, pos: [0, 0.22, 3.19] as const },
      { size: [0.03, 0.025, 6.22] as const, pos: [-2.75, 0.22, 0.1] as const },
      { size: [0.03, 0.025, 6.22] as const, pos: [2.75, 0.22, 0.1] as const },
    ];
    trimEdges.forEach((t) => {
      const m = new THREE.Mesh(
        regGeo(new THREE.BoxGeometry(t.size[0], t.size[1], t.size[2])),
        goldTrimMat
      );
      m.position.set(t.pos[0], t.pos[1], t.pos[2]);
      theaterGroup.add(m);
    });

    const floorMesh = new THREE.Mesh(
      regGeo(new THREE.BoxGeometry(5.1, 0.03, 5.75)),
      floorCarpetMat
    );
    floorMesh.position.set(0, 0.23, 0.1);
    floorMesh.receiveShadow = !isSoftwareGl;
    theaterGroup.add(floorMesh);

    // 2. Curved IMAX GT Screen & Proscenium Frame
    const screenWidth = 4.55;
    const screenHeight = 2.15;
    const screenArc = 0.26;
    const fallbackScreenTex = regTex(createFallbackScreenTexture());

    const screenMat = regMat(
      new THREE.MeshStandardMaterial({
        map: fallbackScreenTex,
        emissiveMap: fallbackScreenTex,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.72,
        roughness: 0.55,
        metalness: 0.05,
        side: THREE.DoubleSide,
      })
    );

    const curvedScreenGeo = regGeo(
      createCurvedScreenGeometry(screenWidth, screenHeight, screenArc)
    );
    const curvedScreenMesh = new THREE.Mesh(curvedScreenGeo, screenMat);
    curvedScreenMesh.position.set(0, 1.56, -2.36);
    theaterGroup.add(curvedScreenMesh);

    // Matte black acoustic backing bezel behind curved screen
    const screenBackingGeo = regGeo(
      createCurvedScreenGeometry(screenWidth + 0.22, screenHeight + 0.2, screenArc)
    );
    const screenBackingMesh = new THREE.Mesh(screenBackingGeo, frameDarkMat);
    screenBackingMesh.position.set(0, 1.56, -2.41);
    theaterGroup.add(screenBackingMesh);

    // Front Stage Apron & Sub-Bass Woofer Array under screen
    const stageApron = new THREE.Mesh(
      regGeo(new THREE.BoxGeometry(4.7, 0.22, 0.65)),
      riserMat
    );
    stageApron.position.set(0, 0.34, -2.22);
    stageApron.receiveShadow = !isSoftwareGl;
    theaterGroup.add(stageApron);

    [-1.4, -0.5, 0.5, 1.4].forEach((xPos) => {
      const subBox = new THREE.Mesh(
        regGeo(new THREE.BoxGeometry(0.45, 0.14, 0.16)),
        frameDarkMat
      );
      subBox.position.set(xPos, 0.33, -1.87);
      theaterGroup.add(subBox);
    });

    // 3. SCREENX 270° Left & Right Side Projection Wing Panels
    const sideScreenGeo = regGeo(new THREE.PlaneGeometry(2.65, 1.85));
    const sideWallBackingGeo = regGeo(new THREE.BoxGeometry(2.74, 1.96, 0.08));

    const sideScreenMaterials: THREE.MeshStandardMaterial[] = [];
    const sidePanelSpecs = [
      { x: -2.46, rotY: Math.PI / 2 - 0.06, backingX: -2.51 },
      { x: 2.46, rotY: -Math.PI / 2 + 0.06, backingX: 2.51 },
    ];

    sidePanelSpecs.forEach((spec) => {
      const sideMat = regMat(
        new THREE.MeshStandardMaterial({
          color: 0x161820,
          emissive: new THREE.Color(0x000000),
          emissiveIntensity: 0,
          roughness: 0.72,
          metalness: 0.12,
        })
      );
      sideScreenMaterials.push(sideMat);

      const panelMesh = new THREE.Mesh(sideScreenGeo, sideMat);
      panelMesh.position.set(spec.x, 1.54, -0.78);
      panelMesh.rotation.y = spec.rotY;
      theaterGroup.add(panelMesh);

      const backing = new THREE.Mesh(sideWallBackingGeo, ribMat);
      backing.position.set(spec.backingX, 1.54, -0.78);
      backing.rotation.y = spec.rotY;
      backing.castShadow = !isSoftwareGl;
      theaterGroup.add(backing);
    });
    sideScreenMatsRef.current = sideScreenMaterials;

    // Load actual cinema stills onto screens asynchronously
    const texLoader = new THREE.TextureLoader();
    texLoader.load(screenHeroImg, (loadedTex) => {
      if (disposed) {
        loadedTex.dispose();
        return;
      }
      loadedTex.colorSpace = THREE.SRGBColorSpace;
      regTex(loadedTex);
      screenMat.map = loadedTex;
      screenMat.emissiveMap = loadedTex;
      screenMat.needsUpdate = true;
      requestRender();
    });

    texLoader.load(screenxSideImg, (loadedSideTex) => {
      if (disposed) {
        loadedSideTex.dispose();
        return;
      }
      loadedSideTex.colorSpace = THREE.SRGBColorSpace;
      regTex(loadedSideTex);
      sideScreenTexRef.current = loadedSideTex;
      if (hallModeRef.current === 'screenx') {
        sideScreenMaterials.forEach((m) => {
          m.map = loadedSideTex;
          m.emissiveMap = loadedSideTex;
          m.emissive.setHex(0xffffff);
          m.emissiveIntensity = 0.65;
          m.color.setHex(0xffffff);
          m.needsUpdate = true;
        });
      }
      requestRender();
    });

    // 4. Stepped Stadium Riser Tiers (5 Rows: A, D, G, J, M) + Aisle LEDs
    const tierCount = 5;
    const tierDepth = 0.78;
    const tierStepY = 0.21;
    const firstTierZ = -0.78;
    const riserWidth = 4.35;

    // Shared Seat Geometries (instanced across all 40 seats via shared buffers)
    const pedestalGeo = regGeo(new THREE.CylinderGeometry(0.05, 0.075, 0.13, 12));
    const cushionGeo = regGeo(new THREE.BoxGeometry(0.28, 0.075, 0.27));
    const backrestGeo = regGeo(new THREE.BoxGeometry(0.27, 0.35, 0.07));
    const headrestGeo = regGeo(new THREE.BoxGeometry(0.21, 0.095, 0.065));
    const armrestGeo = regGeo(new THREE.BoxGeometry(0.042, 0.042, 0.26));
    const ledStripGeo = regGeo(new THREE.BoxGeometry(0.14, 0.015, 0.032));

    const buildCinemaSeat = (isGoldenZone: boolean): THREE.Group => {
      const seatGroup = new THREE.Group();
      const upholsteryMat = isGoldenZone ? seatGoldenZoneMat : seatCrimsonMat;
      const accentMat = isGoldenZone ? goldTrimMat : seatBaseMetalMat;

      const pedestal = new THREE.Mesh(pedestalGeo, seatBaseMetalMat);
      pedestal.position.set(0, 0.065, 0);
      pedestal.castShadow = !isSoftwareGl;
      seatGroup.add(pedestal);

      const cushion = new THREE.Mesh(cushionGeo, upholsteryMat);
      cushion.position.set(0, 0.155, 0.01);
      cushion.castShadow = !isSoftwareGl;
      cushion.receiveShadow = !isSoftwareGl;
      seatGroup.add(cushion);

      const backrest = new THREE.Mesh(backrestGeo, upholsteryMat);
      backrest.position.set(0, 0.34, 0.125);
      backrest.rotation.x = 0.14;
      backrest.castShadow = !isSoftwareGl;
      backrest.receiveShadow = !isSoftwareGl;
      seatGroup.add(backrest);

      const headrest = new THREE.Mesh(headrestGeo, isGoldenZone ? goldTrimMat : upholsteryMat);
      headrest.position.set(0, 0.54, 0.155);
      headrest.rotation.x = 0.1;
      headrest.castShadow = !isSoftwareGl;
      seatGroup.add(headrest);

      const leftArm = new THREE.Mesh(armrestGeo, accentMat);
      leftArm.position.set(-0.155, 0.23, 0.02);
      seatGroup.add(leftArm);

      const rightArm = new THREE.Mesh(armrestGeo, accentMat);
      rightArm.position.set(0.155, 0.23, 0.02);
      seatGroup.add(rightArm);

      return seatGroup;
    };

    const rowGroups: THREE.Group[] = [];
    const seatXPositions = [-1.62, -1.24, -0.86, -0.48, 0.48, 0.86, 1.24, 1.62];

    for (let tierIdx = 0; tierIdx < tierCount; tierIdx++) {
      const riserHeight = (tierIdx + 1) * tierStepY;
      const tierCenterZ = firstTierZ + tierIdx * tierDepth;

      const riserMesh = new THREE.Mesh(
        regGeo(new THREE.BoxGeometry(riserWidth, riserHeight, tierDepth)),
        riserMat
      );
      riserMesh.position.set(0, 0.24 + riserHeight / 2, tierCenterZ);
      riserMesh.receiveShadow = !isSoftwareGl;
      riserMesh.castShadow = !isSoftwareGl;
      theaterGroup.add(riserMesh);

      const tierTopY = 0.24 + riserHeight;

      // Champagne-gold aisle step lights along center and side aisles
      [-0.22, 0.22, -1.96, 1.96].forEach((ax) => {
        const stepLed = new THREE.Mesh(ledStripGeo, aisleLedMat);
        stepLed.position.set(ax, tierTopY + 0.008, tierCenterZ - tierDepth / 2 + 0.04);
        theaterGroup.add(stepLed);
      });

      // Row Seating Group (allows individual 4DX hydraulic motion!)
      const rowGroup = new THREE.Group();
      rowGroup.position.set(0, tierTopY, tierCenterZ + 0.06);
      rowGroup.userData.baseY = tierTopY;
      rowGroup.userData.tierIdx = tierIdx;

      const isGoldenRow = tierIdx === 2; // Row G (middle golden tier)

      seatXPositions.forEach((sx) => {
        const isGoldenCenterSeat = isGoldenRow && Math.abs(sx) < 1.0;
        const seat = buildCinemaSeat(isGoldenCenterSeat);
        seat.position.set(sx, 0, 0);
        rowGroup.add(seat);
      });

      theaterGroup.add(rowGroup);
      rowGroups.push(rowGroup);
    }
    rowGroupsRef.current = rowGroups;

    // 5. Cutaway Architectural Portal Arches & Dolby Atmos 64ch Overhead Rig
    const archSideHeight = 2.95;
    const archZPositions = [-1.65, -0.35, 0.95, 2.25];
    const pillarGeo = regGeo(new THREE.BoxGeometry(0.12, archSideHeight, 0.14));
    const topBeamGeo = regGeo(new THREE.BoxGeometry(5.16, 0.12, 0.14));

    archZPositions.forEach((az) => {
      const leftPillar = new THREE.Mesh(pillarGeo, ribMat);
      leftPillar.position.set(-2.52, 0.24 + archSideHeight / 2, az);
      leftPillar.castShadow = !isSoftwareGl;
      theaterGroup.add(leftPillar);

      const rightPillar = new THREE.Mesh(pillarGeo, ribMat);
      rightPillar.position.set(2.52, 0.24 + archSideHeight / 2, az);
      rightPillar.castShadow = !isSoftwareGl;
      theaterGroup.add(rightPillar);

      const topBeam = new THREE.Mesh(topBeamGeo, ribMat);
      topBeam.position.set(0, 0.24 + archSideHeight, az);
      topBeam.castShadow = !isSoftwareGl;
      theaterGroup.add(topBeam);
    });

    // Overhead Dolby Atmos Ceiling Array (2 longitudinal acoustic trusses + 10 speaker pods)
    const trussGeo = regGeo(new THREE.BoxGeometry(0.08, 0.08, 4.1));
    [-1.1, 1.1].forEach((tx) => {
      const truss = new THREE.Mesh(trussGeo, seatBaseMetalMat);
      truss.position.set(tx, 3.12, 0.3);
      theaterGroup.add(truss);
    });

    const speakerPodGeo = regGeo(new THREE.BoxGeometry(0.22, 0.11, 0.22));
    const speakerRingGeo = regGeo(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 16));
    [-1.1, 1.1].forEach((tx) => {
      [-1.1, -0.3, 0.5, 1.3, 2.0].forEach((tz) => {
        const pod = new THREE.Mesh(speakerPodGeo, frameDarkMat);
        pod.position.set(tx, 3.04, tz);
        pod.rotation.z = tx < 0 ? -0.18 : 0.18;
        theaterGroup.add(pod);

        const driver = new THREE.Mesh(speakerRingGeo, goldTrimMat);
        driver.position.set(tx, 2.98, tz);
        driver.rotation.z = tx < 0 ? -0.18 : 0.18;
        theaterGroup.add(driver);
      });
    });

    // 6. Dual 4K Laser Projection Booth & Volumetric Light Cone
    const boothMesh = new THREE.Mesh(
      regGeo(new THREE.BoxGeometry(2.6, 0.72, 0.55)),
      ribMat
    );
    boothMesh.position.set(0, 2.58, 2.78);
    boothMesh.castShadow = !isSoftwareGl;
    theaterGroup.add(boothMesh);

    const boothGlass = new THREE.Mesh(
      regGeo(new THREE.BoxGeometry(1.7, 0.34, 0.05)),
      projectorGlassMat
    );
    boothGlass.position.set(0, 2.58, 2.5);
    theaterGroup.add(boothGlass);

    // Dual Laser Optical Lenses
    const lensGeo = regGeo(new THREE.CylinderGeometry(0.075, 0.085, 0.1, 18));
    [-0.26, 0.26].forEach((lx) => {
      const lens = new THREE.Mesh(lensGeo, lensGlowMat);
      lens.rotation.x = Math.PI / 2;
      lens.position.set(lx, 2.58, 2.47);
      theaterGroup.add(lens);
    });

    // Volumetric Projection Frustum Cone from Booth to Curved Screen
    const beamTex = regTex(createBeamTexture());
    const beamGeo = regGeo(new THREE.BufferGeometry());
    // Frustum vertices: projector aperture (small rectangle at z=2.45, y=2.58) -> screen corners (z=-2.28)
    const p0 = [-0.32, 2.66, 2.45];
    const p1 = [0.32, 2.66, 2.45];
    const p2 = [0.32, 2.5, 2.45];
    const p3 = [-0.32, 2.5, 2.45];
    const s0 = [-2.12, 2.58, -2.18];
    const s1 = [2.12, 2.58, -2.18];
    const s2 = [2.12, 0.54, -2.18];
    const s3 = [-2.12, 0.54, -2.18];

    const beamPositions = new Float32Array([
      // Top face
      ...p0, ...p1, ...s1, ...p0, ...s1, ...s0,
      // Bottom face
      ...p3, ...s2, ...p2, ...p3, ...s3, ...s2,
      // Left face
      ...p0, ...s0, ...s3, ...p0, ...s3, ...p3,
      // Right face
      ...p1, ...p2, ...s2, ...p1, ...s2, ...s1,
    ]);
    const beamUvs = new Float32Array([
      0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1,
      0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,
      0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0,
      0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1,
    ]);
    beamGeo.setAttribute('position', new THREE.BufferAttribute(beamPositions, 3));
    beamGeo.setAttribute('uv', new THREE.BufferAttribute(beamUvs, 2));
    beamGeo.computeVertexNormals();

    const beamMat = regMat(
      new THREE.MeshBasicMaterial({
        map: beamTex,
        transparent: true,
        opacity: 0.24,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
      false
    );
    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    theaterGroup.add(beamMesh);
    beamMeshRef.current = beamMesh;

    wireableMaterialsRef.current = wireableMats;

    const clock = new THREE.Clock();

    const scheduleFrame = () => {
      if (disposed || frameId !== null || softwareTimerId !== null) return;
      frameId = requestAnimationFrame(renderTick);
    };

    const requestRender = () => {
      needsRender = true;
      scheduleFrame();
    };
    requestRenderRef.current = requestRender;

    const afterDraw = (keepRunning: boolean) => {
      if (!keepRunning || disposed) return;
      if (isSoftwareGl) {
        softwareTimerId = window.setTimeout(() => {
          softwareTimerId = null;
          if (!disposed) {
            needsRender = true;
            scheduleFrame();
          }
        }, 100);
      } else {
        scheduleFrame();
      }
    };

    const renderTick = () => {
      frameId = null;
      if (disposed) return;

      const delta = Math.min(clock.getDelta(), 0.05);
      let keepRunning = false;

      // 4DX hydraulic motion row articulation
      if (hallModeRef.current === '4dx') {
        motionTime += delta * 3.1;
        rowGroupsRef.current.forEach((rg, idx) => {
          const baseY = rg.userData.baseY as number;
          const phase = motionTime - idx * 0.45;
          rg.position.y = baseY + Math.sin(phase) * 0.025;
          rg.rotation.x = Math.sin(phase * 0.85) * 0.045;
          rg.rotation.z = Math.cos(phase * 0.7) * 0.028;
        });
        needsRender = true;
        keepRunning = true;
      } else {
        // Settle rows back smoothly to neutral
        let settling = false;
        rowGroupsRef.current.forEach((rg) => {
          const baseY = rg.userData.baseY as number;
          if (
            Math.abs(rg.position.y - baseY) > 0.0005 ||
            Math.abs(rg.rotation.x) > 0.0005 ||
            Math.abs(rg.rotation.z) > 0.0005
          ) {
            rg.position.y = THREE.MathUtils.damp(rg.position.y, baseY, 10, delta);
            rg.rotation.x = THREE.MathUtils.damp(rg.rotation.x, 0, 10, delta);
            rg.rotation.z = THREE.MathUtils.damp(rg.rotation.z, 0, 10, delta);
            settling = true;
          } else {
            rg.position.y = baseY;
            rg.rotation.set(0, 0, 0);
          }
        });
        if (settling) {
          needsRender = true;
          keepRunning = true;
        }
      }

      if (desiredCameraPosRef.current && desiredTargetRef.current) {
        const lambda = 7.5;
        camera.position.x = THREE.MathUtils.damp(
          camera.position.x,
          desiredCameraPosRef.current.x,
          lambda,
          delta
        );
        camera.position.y = THREE.MathUtils.damp(
          camera.position.y,
          desiredCameraPosRef.current.y,
          lambda,
          delta
        );
        camera.position.z = THREE.MathUtils.damp(
          camera.position.z,
          desiredCameraPosRef.current.z,
          lambda,
          delta
        );

        controls.target.x = THREE.MathUtils.damp(
          controls.target.x,
          desiredTargetRef.current.x,
          lambda,
          delta
        );
        controls.target.y = THREE.MathUtils.damp(
          controls.target.y,
          desiredTargetRef.current.y,
          lambda,
          delta
        );
        controls.target.z = THREE.MathUtils.damp(
          controls.target.z,
          desiredTargetRef.current.z,
          lambda,
          delta
        );

        const posDiff = camera.position.distanceTo(desiredCameraPosRef.current);
        const tgtDiff = controls.target.distanceTo(desiredTargetRef.current);
        if (posDiff < 0.005 && tgtDiff < 0.005) {
          camera.position.copy(desiredCameraPosRef.current);
          controls.target.copy(desiredTargetRef.current);
          desiredCameraPosRef.current = null;
          desiredTargetRef.current = null;
        } else {
          keepRunning = true;
        }
        needsRender = true;
      }

      controls.autoRotate = !isSoftwareGl && autoRotateRef.current;
      const controlsMoved = controls.update();
      if (controlsMoved || controls.autoRotate) {
        keepRunning = true;
        needsRender = true;
      }

      if (needsRender) {
        renderer.render(scene, camera);
        needsRender = false;
      }

      afterDraw(keepRunning);
    };

    const handleControlStart = () => {
      desiredCameraPosRef.current = null;
      desiredTargetRef.current = null;
      requestRender();
    };

    const handleControlChange = () => {
      needsRender = true;
      scheduleFrame();
    };

    controls.addEventListener('start', handleControlStart);
    controls.addEventListener('change', handleControlChange);

    const resizeObserver = new ResizeObserver((entries) => {
      if (disposed) return;
      for (const entry of entries) {
        const w = Math.max(entry.contentRect.width, 300);
        const h = Math.max(entry.contentRect.height, 340);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
        requestRender();
      }
    });
    resizeObserver.observe(container);

    requestRender();

    return () => {
      disposed = true;
      if (frameId !== null) cancelAnimationFrame(frameId);
      if (softwareTimerId !== null) clearTimeout(softwareTimerId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', handleControlStart);
      controls.removeEventListener('change', handleControlChange);
      controls.dispose();

      geometriesToDispose.forEach((g) => g.dispose());
      materialsToDispose.forEach((m) => m.dispose());
      texturesToDispose.forEach((t) => t.dispose());
      envRenderTarget.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleSelectMode = (mode: HallMode) => {
    hallModeRef.current = mode;
    setHallMode(mode);

    // Toggle SCREENX 270° side wall illumination
    const isScreenX = mode === 'screenx';
    sideScreenMatsRef.current.forEach((mat) => {
      if (isScreenX && sideScreenTexRef.current) {
        mat.map = sideScreenTexRef.current;
        mat.emissiveMap = sideScreenTexRef.current;
        mat.emissive.setHex(0xffffff);
        mat.emissiveIntensity = 0.65;
        mat.color.setHex(0xffffff);
      } else {
        mat.map = null;
        mat.emissiveMap = null;
        mat.emissive.setHex(0x000000);
        mat.emissiveIntensity = 0;
        mat.color.setHex(0x161820);
      }
      mat.needsUpdate = true;
    });

    if (beamMeshRef.current) {
      const mat = beamMeshRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = mode === 'imax' ? 0.26 : 0.16;
    }

    requestRenderRef.current();
  };

  const handleToggleAutoRotate = () => {
    const next = !autoRotate;
    autoRotateRef.current = next;
    setAutoRotate(next);
    if (controlsRef.current) {
      controlsRef.current.autoRotate = !isSoftwareGlRef.current && next;
    }
    requestRenderRef.current();
  };

  const handleToggleWireframe = () => {
    const next = !wireframe;
    wireframeRef.current = next;
    setWireframe(next);
    wireableMaterialsRef.current.forEach((m) => {
      m.wireframe = next;
    });
    requestRenderRef.current();
  };

  const handleSelectPreset = (preset: CameraPreset) => {
    setActivePreset(preset);
    const config = CAMERA_PRESETS[preset];
    desiredCameraPosRef.current = config.pos.clone();
    desiredTargetRef.current = config.target.clone();

    // Pause autoRotate when inspecting G-row POV so user can look straight at the screen
    if (preset === 'goldenSeat' && autoRotateRef.current) {
      autoRotateRef.current = false;
      setAutoRotate(false);
      if (controlsRef.current) {
        controlsRef.current.autoRotate = false;
      }
    }

    requestRenderRef.current();
  };

  const handleResetView = () => {
    handleSelectPreset('cutaway');
  };

  return (
    <div className="relative w-full h-[400px] sm:h-[490px] rounded-2xl overflow-hidden bg-[#101114] border border-white/10 select-none">
      {/* Dedicated WebGL Mount Container (Empty, isolated from React HUD) */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top-Left Hall Architecture Spec Pill */}
      <div className="pointer-events-none absolute top-3.5 left-3.5 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#181A20]/90 border border-white/10 text-[11px] text-[#9499A6] font-mono">
        <span className="text-[#C2A878] font-bold">{brandName} GT</span>
        <span className="text-white/20">·</span>
        <span>
          {hallMode === 'imax' && 'IMAX 1.90:1 곡면 레이저'}
          {hallMode === '4dx' && '4DX 모션 액추에이터 가동'}
          {hallMode === 'screenx' && 'SCREENX 270° 3면 투사'}
        </span>
      </div>

      {/* Top-Right Gesture Hint */}
      <div className="pointer-events-none hidden sm:flex absolute top-3.5 right-3.5 items-center gap-2 px-3 py-1.5 rounded-full bg-[#181A20]/90 border border-white/10 text-[11px] text-[#9499A6]">
        <span>드래그 회전 · 휠 확대/축소 · 우클릭 이동</span>
      </div>

      {/* Collapsible Bottom Control Dock (Solid/translucent without backdrop-blur over WebGL) */}
      <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center w-max max-w-[95%]">
        <button
          type="button"
          onClick={() => setIsHudExpanded((prev) => !prev)}
          className="mb-1.5 px-2.5 py-0.5 rounded-full bg-[#181A20] border border-white/10 text-[10px] text-[#9499A6] hover:text-[#EAECEF] flex items-center gap-1 transition-colors"
          aria-label={isHudExpanded ? '컨트롤 접기' : '컨트롤 펼치기'}
        >
          <span>{isHudExpanded ? '뷰어 컨트롤 접기' : '뷰어 컨트롤 열기'}</span>
          {isHudExpanded ? (
            <ChevronDown className="w-3 h-3" />
          ) : (
            <ChevronUp className="w-3 h-3" />
          )}
        </button>

        {isHudExpanded && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 px-2.5 py-2 rounded-2xl bg-[#181A20]/95 border border-white/10">
            {/* Special Hall Format Mode Switcher */}
            <div className="flex items-center gap-1 pr-1.5 border-r border-white/10">
              <button
                type="button"
                onClick={() => handleSelectMode('imax')}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-colors border flex items-center gap-1 ${
                  hallMode === 'imax'
                    ? 'bg-[#B82935] hover:bg-[#9E202B] text-[#EAECEF] border-[#B82935]'
                    : 'bg-[#101114] text-[#9499A6] hover:text-[#EAECEF] border-white/10'
                }`}
              >
                <Film className="w-3 h-3" />
                <span>IMAX 4K</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectMode('4dx')}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-colors border flex items-center gap-1 ${
                  hallMode === '4dx'
                    ? 'bg-[#B82935] hover:bg-[#9E202B] text-[#EAECEF] border-[#B82935]'
                    : 'bg-[#101114] text-[#9499A6] hover:text-[#EAECEF] border-white/10'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>4DX 모션</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectMode('screenx')}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-colors border flex items-center gap-1 ${
                  hallMode === 'screenx'
                    ? 'bg-[#B82935] hover:bg-[#9E202B] text-[#EAECEF] border-[#B82935]'
                    : 'bg-[#101114] text-[#9499A6] hover:text-[#EAECEF] border-white/10'
                }`}
              >
                <Monitor className="w-3 h-3" />
                <span>SCREENX</span>
              </button>
            </div>

            {/* Camera Angle Presets */}
            <div className="flex items-center gap-1 pr-1.5 border-r border-white/10">
              {(Object.keys(CAMERA_PRESETS) as CameraPreset[]).map((presetKey) => (
                <button
                  key={presetKey}
                  type="button"
                  onClick={() => handleSelectPreset(presetKey)}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-colors border ${
                    activePreset === presetKey
                      ? 'bg-white/[0.08] text-[#C2A878] border-[#C2A878]/60'
                      : 'bg-[#101114] text-[#9499A6] hover:text-[#EAECEF] border-white/10'
                  }`}
                >
                  {CAMERA_PRESETS[presetKey].label}
                </button>
              ))}
            </div>

            {/* Utility Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleToggleAutoRotate}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-colors border flex items-center gap-1 ${
                  autoRotate
                    ? 'bg-white/[0.08] text-[#EAECEF] border-white/25'
                    : 'bg-[#101114] text-[#9499A6] hover:text-[#EAECEF] border-white/10'
                }`}
              >
                <RotateCw className="w-3 h-3" />
                <span>회전</span>
              </button>

              <button
                type="button"
                onClick={handleToggleWireframe}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-colors border flex items-center gap-1 ${
                  wireframe
                    ? 'bg-white/[0.08] text-[#C2A878] border-[#C2A878]/60'
                    : 'bg-[#101114] text-[#9499A6] hover:text-[#EAECEF] border-white/10'
                }`}
              >
                <Box className="w-3 h-3" />
                <span>구조선</span>
              </button>

              <button
                type="button"
                onClick={handleResetView}
                className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-[#101114] text-[#9499A6] hover:text-[#EAECEF] border border-white/10 transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>초기화</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
