import React, { useState } from "react";
import { nanoid } from "@reduxjs/toolkit";
import { useAppSelector } from "@/app/hooks";
import { useAppDispatch } from "@/app/hooks";
import { selectAllUsers } from "../users/usersSlice";
import { selectCurrentUsername } from "../auth/authSlice";
import { type Post } from "./postsSlice";
import { addNewPost } from "./postsSlice";

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
  const [addRequestStatus, setAddRequestStatus] = useState<"idle" | "pending">(
    "idle"
  );
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectAllUsers);
  // Remove the selector for current username, as we will use the selected author from the form
  // const userId = useAppSelector(selectCurrentUsername)!

  const handleSubmit = async (e: React.FormEvent<AddPostFormElements>) => {
    // Prevent server submission
    e.preventDefault();

    const { elements } = e.currentTarget;
    const title = elements.postTitle.value;
    const content = elements.postContent.value;
    const userId = elements.postAuthor.value;

    const form = e.currentTarget;

    try {
      setAddRequestStatus("pending");
      await dispatch(addNewPost({ title, content, user: userId })).unwrap();

      form.reset();
    } catch (err) {
      console.error("Failed to save the post: ", err);
    } finally {
      setAddRequestStatus("idle");
    }
  };

  const usersOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

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
