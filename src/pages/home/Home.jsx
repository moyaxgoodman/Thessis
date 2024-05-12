// Home.jsx

import { useState } from 'react';
import Posts from '../../components/posts/Posts';
import './home.scss';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg sticky-top">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <form className="form-inline my-2 my-lg-0 d-flex gap-2">
            <input
              className="form-control mr-sm-2"
              type="search"
              placeholder="Search Post"
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      </nav>
      <Posts searchQuery={searchQuery} />
    </div>
  );
};

export default Home;
