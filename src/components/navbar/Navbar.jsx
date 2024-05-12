import Navbar from 'react-bootstrap/Navbar';
function NavBarLayout() {
  return (
    <>
      <Navbar bg="success" data-bs-theme="dark" className='sticky-top w-full'>
        <Navbar.Brand href="/" className="fs-10">
          <div className='ml-2' style={{marginLeft:"10px"}}>
          Pocket Donation Bank
          </div>
        </Navbar.Brand>
      </Navbar>
    </>
  );
}

export default NavBarLayout;
