import React, { useEffect, useState } from 'react';
import './aboutUs.scss';
import { makeRequest } from '../../axios';

function AboutUs() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await makeRequest.get('/posts');
        const latestPosts = response.data.slice(0, 10); // Get only the latest 10 posts
        setPosts(latestPosts); 
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className='container'>
      <div className='heading'>
        <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img className="d-block w-100" src="/upload/charity-2.jpg" alt="First slide"/>
          </div>
          <div className="carousel-item">
            <img className="d-block w-100" src="/upload/charity-2.jpg" alt="Second slide"/>
          </div>
          <div className="carousel-item">
            <img className="d-block w-100" src="/upload/charity-2.jpg" alt="Third slide"/>
          </div>
        </div>
        <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        </a>
        <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
        </a>
      </div>
      </div>
      <p>An organization committed to addressing societal issues or advancing a certain cause without the primary purpose of financial gain is known as a non-profit charity. Charities, as opposed to for-profit companies, focus their resources and efforts on projects that help people, communities, or the environment. These organizations are restricted from distributing their profits to shareholders or individual members; instead, any remaining funds are reinvested in furthering their objective. In order to solve social issues, advance education, fund healthcare programs, assist with disaster relief operations, and support a range of humanitarian causes, charities are essential. Non-profit organizations work to uphold the values of generosity and compassion by promoting causes, raising money, and engaging the public in volunteer work.</p>
      <div>
        <h3>Posts</h3>
        <div className=''>
          {posts.map(post => (
            <div key={post.id} className="card" style={{ width: "100%" }}>
              <div className="card-body d-flex">
                <div>
                    <h5 className="card-title">{post.name}</h5>
                    <p className="card-text">{post.type}</p>
                    <img src={`${post.img}`} alt="img" style={{width:"200px",height:"150px"}}/>
                </div>
                <p className='mt-4 p-2'>{post.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
