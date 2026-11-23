import { BrandConfig } from '../types';

export const BRAND_PRESETS: Record<string, BrandConfig> = {
  cine_v: {
    id: 'cine_v',
    name: 'CINE V',
    tagline: 'SPECIAL THEATER',
    shortCode: 'V',
    theme: 'red',
    accentColor: '#B82935',
    featuredMovie: {
      title: '<아바타: 불과 재> IMAX 3D',
      badge: '이번 주 특별관 예매율 1위',
      image: '/src/assets/images/hero_cinematic_blockbuster_1794209491695.jpg',
      subhead: 'IMAX의 압도적 스케일부터 4DX의 오감 모션까지. 당신에게 딱 맞는 특별관 스펙을 미리 경험하고 최고의 명당을 선택하세요.',
    },
    branches: [
      'CINE V 용산 플래그십 (IMAX GT관)',
      'CINE V 왕십리 (IMAX 3D관)',
      'CINE V 영등포 타임스퀘어',
      'CINE V 강남 센트럴',
    ],
  },
  cineverse: {
    id: 'cineverse',
    name: 'CINEVERSE',
    tagline: 'METASPACE MULTIPLEX',
    shortCode: 'CV',
    theme: 'purple',
    accentColor: '#7B68A6',
    featuredMovie: {
      title: '<사이버 시티 2099: 네오 도쿄> 270° PLF',
      badge: '차세대 가상 파노라마 최초 상영',
      image: '/src/assets/images/screenx_panoramic_scene_1794209493353.jpg',
      subhead: '정면과 양측 벽면을 360도로 에워싸는 270도 미래도시 파노라마. 일렉트릭 공간 음향과 함께 시각의 한계를 돌파하세요.',
    },
    branches: [
      'CINEVERSE 강남 메타스페이스 (3면 PLF관)',
      'CINEVERSE 판교 알파돔 메가관',
      'CINEVERSE 코엑스 슈퍼플렉스',
      'CINEVERSE 성수 아틀리에',
    ],
  },
  v_cinema: {
    id: 'v_cinema',
    name: 'V-CINEMA',
    tagline: 'EXPEDITION CINEMA',
    shortCode: 'VC',
    theme: 'emerald',
    accentColor: '#2E7D67',
    featuredMovie: {
      title: '<익스페디션: 붉은 행성 4K> DUAL LASER',
      badge: '전 회차 전석 매진 신화 달성',
      image: '/src/assets/images/aspect_ratio_movie_frame_1794209493491.jpg',
      subhead: '미개척지 행성의 협곡을 질주하는 탐사선의 진동을 그대로. 4K 레이저와 오감 모션시트로 온몸으로 느끼는 극한의 탐험.',
    },
    branches: [
      'V-CINEMA 송도 센트럴 (IMAX 레이저관)',
      'V-CINEMA 잠실 월드타워',
      'V-CINEMA 일산 킨텍스',
      'V-CINEMA 대전 신세계',
    ],
  },
  cine_nova: {
    id: 'cine_nova',
    name: 'CINE NOVA',
    tagline: 'PREMIUM VIP BOUTIQUE',
    shortCode: 'CN',
    theme: 'amber',
    accentColor: '#C2A878',
    featuredMovie: {
      title: '<더 마제스틱 오페라> PRIVATE BOX VIP',
      badge: '👑 최고급 VIP 부티크 전용관 프리미어',
      image: '/src/assets/images/private_box_vip_lounge_1794209493890.jpg',
      subhead: '단 한 팀만을 위한 프라이빗 스위트룸. 뱅앤올룹슨 하이엔드 어쿠스틱과 웰컴 샴페인 케이터링이 선사하는 궁극의 품격.',
    },
    branches: [
      'CINE NOVA 청담 프리미어 라운지 (VIP 전용관)',
      'CINE NOVA 한남 나인원 스위트',
      'CINE NOVA 해운대 엘시티',
      'CINE NOVA 압구정 헤리티지',
    ],
  },
};
