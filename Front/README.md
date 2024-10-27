# Quasar App (todo-app)

### 룸 역활 필드
chatUsers 에
role 필드 구성
```
[
  'Master',
  'Manager',
  'User',
  'Block'
]
```
마스터가 매니저를 뽑아
매니저는 일반사용자의 블럭/논블럭 권한
마스터가 방을 나가려면 매니저 중에 한명에게 마스터 권한을 넘기고
매니저가 없는 방은 방을 폭파시킨다.

status : BLEAN
true : 룸에 조인한 상태 가능상태 기본값
false : 룸에서 나간 상태

rooms 에 비번 생성할때
개설자의 salt값을 => 새로운 salt값을 만들고 저장 하는 salt 필드 추가
