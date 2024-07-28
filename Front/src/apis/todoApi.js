import { api } from 'boot/axios';

const URL = '/api/todo';

// 생성
const create = async ({ title, done }) => {
	const res = await api.post(URL, {
		title, done
	});
	return res.data;
}

const list = async(offset, limit)=>{
	const res = await api.get(URL, {
		params:{
			offset, 
			limit
		}
	})

	res.data.rows.forEach(row=>{
		row.disable = false;
	})

	return res.data;
}

const update = async(id, done) =>{
	const res = await api.put(`${URL}/${id}`, {done})
	return res.data == 1;
}

const remove = async (id)=> {
	const res = await api.delete(`${URL}/${id}`);
	return res.data == 1;
}

export default {
	create, list, update, remove
}