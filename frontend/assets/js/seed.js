// Seed data for demo mode
export function seedNotices() {
  return [
    { id:'n1', title:'[긴급] 뒤산 보호구역 봉인 점검', category:'안전', author:'dev', createdAt:'2035-03-05', body:'뒤산 보호구역 봉인이 일부 느슨해진 것으로 확인되었습니다. 모든 훈련 조는 지도교사 배치 후 진입 바랍니다.' },
    { id:'n2', title:'한강 야간 실습 대기', category:'훈련', author:'leon', createdAt:'2035-03-02', body:'야간 실습 일정은 기상 악화로 1일 연기되었습니다. 대기 상태에서 장비를 점검하십시오.' },
    { id:'n3', title:'기숙사 네트워크 점검', category:'생활', author:'mirena', createdAt:'2035-03-01', body:'기숙사 와이파이 및 능력 제어기 연동 시스템이 22시~24시 유지보수됩니다.' }
  ];
}

export function seedEvents() {
  const now = new Date();
  const m = now.getMonth();
  return [
    { date:`${now.getFullYear()}-${String(m+1).padStart(2,'0')}-05`, title:'교내 능력 리그 예선', tag:'대회' },
    { date:`${now.getFullYear()}-${String(m+1).padStart(2,'0')}-12`, title:'도심 야간 헌팅 실습', tag:'실습' },
    { date:`${now.getFullYear()}-${String(m+1).padStart(2,'0')}-21`, title:'연구동 장비 점검', tag:'안전' },
    { date:`${now.getFullYear()}-${String(m+1).padStart(2,'0')}-27`, title:'방어 전술 합동 세미나', tag:'세미나' }
  ];
}

export function seedMeals() {
  return {
    default: [{ item:'능력자 에너지 플랜터 샐러드', kcal: 540, origin:'국내산' }, { item:'한강 특화 오메가-브리오 브로스', kcal: 620, origin:'국내산' }]
  };
}

export function seedCommunity() {
  return {
    자유게시판: [
      { id:'c1', user:'미레나', role:'npc', at:'2035-03-01T10:00:00Z', text:'에이, 나한텐 숨겨도 소용없어. 오늘 밤 커뮤에서 봐!' },
      { id:'c2', user:'루카', role:'npc', at:'2035-03-01T10:03:00Z', text:'와, 전기 컨디션 미쳤는데? 누구 스파링할 사람!' }
    ],
    '기숙사 라운지': [
      { id:'d1', user:'아이리스', role:'npc', at:'2035-03-01T08:00:00Z', text:'제가 치료해드릴게요. 잠깐만요…! 오늘 순찰은 제가 맡을게요.' },
      { id:'d2', user:'레온', role:'npc', at:'2035-03-01T08:10:00Z', text:'비켜, 내가 앞장설게. 아이리스가 올 때까지 막는다.' }
    ],
    '훈련동': [
      { id:'t1', user:'카일', role:'npc', at:'2035-03-01T06:30:00Z', text:'잡담은 나중에. 지금은 떨어지지 마.' },
      { id:'t2', user:'하린', role:'npc', at:'2035-03-01T06:32:00Z', text:'아이리스 언니가 너에게 신경쓰는 이유... 난 알고 있어.' }
    ]
  };
}

export function seedFacilities() {
  return [
    { name:'능력 실습동 A', availability:78, status:'정상', tag:'훈련' },
    { name:'연구동 위상측정실', availability:42, status:'점검', tag:'연구' },
    { name:'기숙사 제어기', availability:90, status:'정상', tag:'안전' },
    { name:'옥상 정원', availability:65, status:'예약가능', tag:'휴식' }
  ];
}
