import React from "react";
import { nanoid } from "@reduxjs/toolkit";
import { useAppSelector } from "@/app/hooks";
import { useAppDispatch } from "@/app/hooks";
import { selectAllUsers } from "../users/usersSlice";
import { selectCurrentUsername } from "../auth/authSlice";
import { type Post, postAdded } from "./postsSlice";
// TS types for the input fields
// See: https://epicreact.dev/how-to-type-a-react-form-on-submit-handler/
interface AddPostFormFields extends HTMLFormControlsCollection {
  postAuthor: any;
  postTitle: HTMLInputElement;
  postContent: HTMLTextAreaElement;
}
interface AddPostFormElements extends HTMLFormElement {
  readonly elements: AddPostFormFields;
}

export const AddPostForm = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectAllUsers);
  const userId = useAppSelector(selectCurrentUsername)!

  const handleSubmit = (e: React.FormEvent<AddPostFormElements>) => {
    // Prevent server submission
    e.preventDefault();

    const { elements } = e.currentTarget;
    const title = elements.postTitle.value;
    const content = elements.postContent.value;
    const userId = elements.postAuthor.value;
    console.log("Values: ", { title, content });
    // Dispatch the `postAdded` action with id, title, and content as separate arguments
    const id = nanoid();
    dispatch(postAdded(title, content, userId));
    
    e.currentTarget.reset();
  };

  const usersOptions = users.map(user => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ))

  return (
    <section>
      <h2>Add a New Post</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="postTitle">Post Title:</label>
        <input type="text" id="postTitle" defaultValue="" required />
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" name="postAuthor" required>
          <option value=""></option>
          {usersOptions}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          defaultValue=""
          required
        />
        <button>Save Post</button>
      </form>
    </section>
  );
};
