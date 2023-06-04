import { $axios } from "./request";
export function formatImageLink(filename='') {
    return `${$axios.defaults.baseURL}/common/download?name=${filename}`;
}