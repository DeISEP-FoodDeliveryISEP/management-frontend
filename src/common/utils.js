import { $axios } from "./request";
import { toaster } from "baseui/toast";
export function formatImageLink(filename='') {
    return `${$axios.defaults.baseURL}/common/download?name=${filename}`;
}

export function checkNotLogin(res, navigate) {
    if (res.code === 0 && res.msg === 'NOTLOGIN') {
        setTimeout(()=>{
            toaster.info('Redirect to login page...');
        }, 500);
        setTimeout(()=> {
            navigate('/login');
        }, 2000);
    }
}