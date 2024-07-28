import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { Notify } from 'quasar'

// console.log("env.API", process.env.API);
const api = axios.create({ baseURL: process.env.API });

api.interceptors.response.use(function (response) {
	// 2xx 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
	// 응답 데이터가 있는 작업 수행
	return response;
}, function (error) {
	// console.log(error);
	switch (error.response.status / 100) {
		case 5:
			Notify.create({
				type: "negative",
				message: error.response.data
			})
			return false;
		default:
			return Promise.reject(error);
	}
});

export default boot(({ app }) => {
	app.config.globalProperties.$axios = axios
	app.config.globalProperties.$api = api
})

export { api, axios }
