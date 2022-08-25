
export default function Asset({asset}) {
    // const {index,params:{creator, total}} =asset
  return (
    <div>
        <p>ID: {asset.index}</p>
        <p>Total: {asset.params.total}</p>
        <p>Name: {asset.params.name}</p>
        <p>Unit Name: {asset.params['unit-name']}</p>
        <p></p>
    </div>
  )
}
