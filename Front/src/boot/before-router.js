import { boot } from 'quasar/wrappers'
import useUser from 'src/stores/useUser';
import { Cookies, Notify } from 'quasar'
import userApi from 'src/apis/userApi';
import { socket } from 'boot/socket';

export default boot(({ router }) => {
	router.beforeEach(async (to, from, next) => {
		const userStore = useUser();
		if (!userStore.user && Cookies.has('token')) {
			await userApi.auth();
		}
		// 로그인이 되었는데 소켓이 연결이 안되었으면 소켓에 접속하자
		console.log('ss=>', userStore.isLogin, !socket.connected);
		if (userStore.isLogin && !socket.connected) {
			socket.auth = { userId: userStore.user.id };
			socket.connect();
		}

			if (to.meta.access == 'member') {
				if (userStore.isLogin) {
					return next();
				} else {
					Notify.create({ type: 'negative', message: '회원만 접근 가능합니다.' })
					return next({ name: 'login' })
				}
			}

		next();
	})
})