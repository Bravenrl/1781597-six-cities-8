
function Preloader(): JSX.Element {

  return (
    <div style={{
      position: 'fixed', top: '200px', left: '35%',
      width: '30%', height: '30%', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
    }}
    >
      <img src="img/loading.svg" alt="Loading" />
    </div>
  );
}

export default Preloader;
