import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { Link } from "react-router-dom";
import { AddPostForm } from "./AddPostForm";
import { PostAuthor } from "./PostAuthor";
import { TimeAgo } from "@/components/TimeAgo";
import { ReactionButtons } from "./ReactionButtons";
import { fetchPosts, selectAllPosts, selectPostsStatus, selectPostsError } from "./postsSlice";
import { Spinner } from '@/components/Spinner'

type PostExcerptProps = any

function PostExcerpt({ post }: PostExcerptProps) {
  return (
    <article className="post-excerpt" key={post.id}>
      <h3>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>
      <ReactionButtons post={post} />
    </article>
  )
}

export const PostsMainPage = () => {
  // Select the `state.posts` value from the store into the component
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectAllPosts);
  const postStatus = useAppSelector(selectPostsStatus);
  const postsError = useAppSelector(selectPostsError)
  
  useEffect(() => {
    if (postStatus === "idle") {
      dispatch(fetchPosts());
    }
  }, [postStatus, dispatch]);

  let content: React.ReactNode

  if (postStatus === 'pending') {
    content = <Spinner text="Loading..." />
  } else if (postStatus === 'succeeded') {
    // Sort posts in reverse chronological order by datetime string
    const orderedPosts = posts
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))

    content = orderedPosts.map(post => (
      <PostExcerpt key={post.id} post={post} />
    ))
  } else if (postStatus === 'failed') {
    content = <div>{postsError}</div>
  }

  return (
    <>
      <section className="posts-list">
        <h2>Posts</h2>
        {content}
      </section>
      <AddPostForm />
    </>
  );
};
