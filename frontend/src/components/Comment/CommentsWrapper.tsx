import classNames from "classnames";
import Comment from "./Comment";
import React from "react";

type Props = {
    comments?: Array<string>
}
export const CommentsWrapper: React.FC<Props> = ({comments}) => {

    return (<div className={classNames('comments-container', {'hide': comments?.length === 0})}>
        {comments?.map((id) => (<Comment key={id} commentId={id}/>))}
    </div>)
}