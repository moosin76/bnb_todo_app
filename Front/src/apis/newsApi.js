import { api } from 'boot/axios';
const URL = '/api/news';

const crawling = async () => {
  const { data } = await api.get(`${URL}/crawling`);
  return data;
}

const list = async (params) => {
  const { data } = await api.get(`${URL}/list`, { params });
  return data;
}

const columns = [
  { name: 'img', label: "이미지", field: 'img', sortable: false, align: 'center', },
  { name: 'title', label: "제목", field: 'title', sortable: true, align: 'left' },
  // { name: 'content', label: "내용", field: 'content', sortable: true },
  { name: 'time', label: "시간", field: 'time', sortable: true, align: "center" },
]

const pagination = {
  rowsPerPage: 12,
  page: 1,
  sortBy: 'time',
  descending: false,
  rowsNumber: 0, // 서버 사이드
  search: "",
}

export default {
  crawling, list,
  columns, pagination
}
