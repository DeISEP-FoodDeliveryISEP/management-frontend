import {Spinner} from 'baseui/spinner';
export function Loading() {
  return (
  <div style={{display: "flex", width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}}>
    <Spinner />
  </div>);
}