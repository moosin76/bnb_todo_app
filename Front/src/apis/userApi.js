import { api } from 'boot/axios';
import useUser from 'src/stores/useUser';
import { Cookies } from 'quasar'

const URL = '/api/user';

const join = async (form) => {
	const { data } = await api.post(`${URL}/join`, form);
	return data;
}

const login = async (form) => {
	const { data } = await api.post(`${URL}/login`, form);
	if (data) {
		api.defaults.headers.common['Authorization'] = 'bearer ' + data.token;
		Cookies.set('token', data.token);
		const userStore = useUser();
		userStore.login(data.user);
		return data.user;
	} else {
		return null;
	}
}

const logout = () => {
	delete api.defaults.headers.common['Authorization'];
	Cookies.remove('token')
	const userStore = useUser();
	userStore.logout();
	return true;
}

const auth = async () => {
	const token = Cookies.get('token');
	const { data } = await api.post(`${URL}/auth`, { token });
	if(data) {
		api.defaults.headers.common['Authorization'] = 'bearer ' + token;
		const userStore = useUser();
		userStore.login(data);
	}
}

export default {
	join, login, logout, auth
}