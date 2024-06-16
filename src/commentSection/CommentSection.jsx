import React, { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

const CommentSection = () => {
  const [commentList, setCommentList] = useState([]);
  const [id, setId] = useState(null);
  const inputRef = useRef(null);

  const insertComment = (listItem, id) => {
    if (!id && inputRef.current.value) {
      listItem.push({
        id: uuidv4(),
        value: inputRef.current.value,
        list: [],
      });
      return listItem;
    }
    for (let i = 0; i < listItem.length; i++) {
      if (listItem[i].id === id) {
        listItem[i].list.push({
          id: uuidv4(),
          value: inputRef.current.value,
          list: [],
        });
        break;
      }
      insertComment(listItem[i].list, id);
    }
    return listItem;
  };
  const handleOnSave = () => {
    if (inputRef.current?.value.length === 0) return;
    const commList = JSON.parse(JSON.stringify(commentList));
    const newList = insertComment(commList, id);
    setCommentList(newList);
    inputRef.current.value = null;
    setId(null);
  };
  const handleOnReply = (id) => () => {
    inputRef.current.focus();
    setId(id);
  };
  const inputRenderer = () => {
    return (
      <div className="d-flex flex-row g-10 p-10">
        <input type="text" placeholder="Comment" ref={inputRef} />
        <button onClick={handleOnSave}>Save</button>
      </div>
    );
  };

  const commentBodyRenderer = (listItem) => {
    if (!listItem || listItem.value === 0) return null;
    return (
      <div className="d-flex flex-col p-10">
        <div className="d-flex flex-row g-10">
          <span>{listItem?.value}</span>
          <button onClick={handleOnReply(listItem?.id)}>Reply</button>
        </div>
        <div>
          {listItem.list &&
            listItem.list.length !== 0 &&
            commentSectionRenderer(listItem.list)}
        </div>
      </div>
    );
  };
  const commentSectionRenderer = (commentList) => {
    return (
      <div className="d-flex flex-col g-10">
        {commentList.map(commentBodyRenderer)}
      </div>
    );
  };
  return (
    <div>
      {inputRenderer()}
      {commentSectionRenderer(commentList)}
    </div>
  );
};

export default CommentSection;
