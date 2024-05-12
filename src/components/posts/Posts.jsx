import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Posts = ({ searchQuery, userId }) => {
  const { isLoading, error, data: posts } = useQuery(['posts', userId], () =>
    makeRequest.get(`/posts?userId=${userId}`).then((res) => res.data)
  );

  // Check if posts is undefined or null before filtering
  const filteredPosts = posts
    ? posts.filter((post) =>
        post.desc && post.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="posts">
      {error ? (
        <div>Something went wrong!</div>
      ) : isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {filteredPosts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;
