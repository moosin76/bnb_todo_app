import { boot } from 'quasar/wrappers'
import useUser from 'src/stores/useUser';
import { Cookies, Notify } from 'quasar'
import userApi from 'src/apis/userApi';

export default boot(({ router }) => {
	router.beforeEach(async (to, from, next) => {
		const userStore = useUser();
		if(!userStore.user && Cookies.has('token')) {
			await userApi.auth();
		}
		
		if(to.meta.access == 'member') {
			if(userStore.isLogin) {
				return next();
			} else {
				Notify.create({type:'negative', message:'회원만 접근 가능합니다.'})
				return next({name:'login'})
			}
		}

		next();
	})
})