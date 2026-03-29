import { roles } from './state.js';

const personalities = {
  iris: {
    opening: '제가 치료해드릴게요. 잠깐만요…! 무엇이 궁금하세요?',
    style: (msg)=>`...헤헤... 괜찮아요. ${msg}`
  },
  leon: {
    opening: '비켜, 내가 앞장설게. 질문만 간결하게.',
    style: (msg)=>`단도직입적으로 말할게. ${msg}`
  },
  mirena: {
    opening: '에이, 숨겨도 소용없어. 다 말해봐.',
    style: (msg)=>`${msg} 나중에 커뮤 터지면 책임질 거지?`
  }
};

const scripts = {
  입학: ['입학은 비공개 스카우트와 위상 공명 테스트로 진행돼요.', '사고·사건에서 능력이 관측되면 초대될 수 있어요.'],
  전입학: ['전입은 케이스별로 상담이 필요해요.', '안전 평가와 제어기 적합성 검사를 함께 진행해요.'],
  기숙사: ['기숙사에는 능력 제어기가 설치되어 있어요.', '22시 이후 외부 적발 시 벌점이 부여돼요.'],
  교육과정: ['국영수과사 심화 + 특능 제어·전술 응용을 함께 배워요.', '실습동과 연구동에서 실전 모의전을 자주 합니다.'],
  동아리: ['전투 실전 동아리, 연구회, 능연회, 배달부 클럽이 인기예요.', '교내 능력 리그 준비 모임이 있어요.'],
  급식: ['에너지 밀도 높은 식단이 제공돼요.', '날짜마다 시드 기반 랜덤 메뉴가 나와요.'],
  시설: ['능력 실습동, 연구동 위상측정실, 옥상 정원 등이 있어요.', '예약은 시설 예약 센터에서 할 수 있어요.'],
  안전규정: ['무단 능력 사용 금지. 한강 주변 단독 출입 금지.', '22시 이후 기숙사 외부 적발 시 벌점이 있어요.'],
  오시는길: ['서울 동북부 재개발 구역, 겉보기 평범한 사립고 캠퍼스예요.', '대중교통: 환승센터 → 셔틀 버스 (가이드 참고).']
};

export function simulateChat(input, npc='iris') {
  const persona = personalities[npc] || personalities.iris;
  const key = Object.keys(scripts).find(k=>input.includes(k)) || '입학';
  const pool = scripts[key];
  const pick = pool[Math.floor(Math.random()*pool.length)];
  return persona.style(pick);
}
