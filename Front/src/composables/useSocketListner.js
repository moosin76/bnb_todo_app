import {onMounted, onUnmounted,} from 'vue';

export default function(socket, evts) {
	const socketEvts = Object.keys(evts);
	onMounted(()=>{
		socketEvts.forEach(evtName=>{
			socket.on(evtName, evts[evtName]);
		})
		if(process.env.DEV) {
			console.log(socket.connected, socket.nsp, socketEvts)
		}
	})

	onUnmounted(()=>{
		socketEvts.forEach(evtName=>{
			socket.off(evtName)
		})
	})

	return socketEvts
}