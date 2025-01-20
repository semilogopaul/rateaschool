import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import Header from "../components/Header";

interface School {
  id: number;
  name: string;
  description: string;
  location: string;
  image: string;
  details: string;
}

interface Comment {
  id: number;
  text: string;
  user: string;
  created_at: string;
}

interface Rating {
  id: number;
  stars: number;
  user: string;
}

const SchoolDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [school, setSchool] = useState<School | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [hoverStars, setHoverStars] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentText, setEditingCommentText] = useState<string>("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const schoolResponse = await api.get(`/schools/${id}/`);
        setSchool(schoolResponse.data);

        const commentsResponse = await api.get(
          `/schools/comments/?school=${id}`
        );
        setComments(commentsResponse.data);

        const ratingsResponse = await api.get(`/schools/ratings/?school=${id}`);
        setRatings(ratingsResponse.data);
      } catch (err: any) {
        setError("Failed to fetch details");
      }
    };
    const fetchUserProfile = async () => {
      try {
        const response = await api.get("/users/profile/");
        setUsername(response.data.username);
      } catch (err: any) {
        setError("Failed to fetch user data");
      }
    };

    fetchDetails();
    fetchUserProfile();
  }, [id]);

  const handleCommentSubmit = async () => {
    if (!newComment) {
      setError("Please enter a comment");
      return;
    }

    try {
      const response = await api.post(`/schools/comments/`, {
        school: id,
        text: newComment,
      });
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (err: any) {
      setError("Failed to submit comment");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await api.delete(`/schools/comments/${commentId}/`);
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (err: any) {
      setError("Failed to delete comment");
    }
  };

  const handleEditComment = (commentId: number, text: string) => {
    setEditingCommentId(commentId);
    setEditingCommentText(text);
  };

  const handleUpdateComment = async () => {
    if (!editingCommentText) {
      setError("Comment text cannot be empty");
      return;
    }

    try {
      await api.put(`/schools/comments/${editingCommentId}/`, {
        text: editingCommentText,
      });
      setComments(
        comments.map((comment) =>
          comment.id === editingCommentId
            ? { ...comment, text: editingCommentText }
            : comment
        )
      );
      setEditingCommentId(null);
      setEditingCommentText("");
    } catch (err: any) {
      setError("Failed to update comment");
    }
  };

  const currentUser = username;

  return (
    <>
      <Header />
      <div className="p-6 bg-white shadow-md rounded-lg">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {school && (
          <>
            <img
              src="https://lh3.googleusercontent.com/p/AF1QipO4fR8TnagUSe1rkNcr9ftS4IypA_6ZzTFFteK5=s1360-w1360-h1020"
              alt={school.name}
              className="w-full h-64 object-cover rounded mb-4"
            />
            <h2 className="text-3xl font-bold mb-2">{school.name}</h2>
            <p className="text-gray-600 mb-2">{school.description}</p>
            <p className="text-sm text-gray-500">
              {school.location.toUpperCase()}
            </p>
            <p className="mt-4">{school.details}</p>
          </>
        )}

        <div className="grid sm:grid-cols-2 gap-8 mt-8 grid-cols-1">
          <div>
            <h3 className="text-2xl font-bold mb-7">Rate this School</h3>
            <div className="rating flex mb-4">
              {[1, 2, 3, 4, 5].map((value) => (
                <label
                  key={value}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoverStars(value)}
                  onMouseLeave={() => setHoverStars(null)}
                >
                  <input
                    type="radio"
                    value={value}
                    name="rating"
                    onChange={async () => {
                      try {
                        const response = await api.post(`/schools/ratings/`, {
                          school: id,
                          stars: value,
                        });
                        setRatings([...ratings, response.data]);
                        setError(null);
                      } catch (err: any) {
                        setError("Failed to submit rating");
                      }
                    }}
                    className="hidden"
                  />
                  <span
                    className={`text-3xl ${
                      hoverStars && value <= hoverStars
                        ? "text-yellow-400"
                        : "text-gray-400"
                    } hover:text-yellow-500 duration-200`}
                  >
                    ★
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-4">
              {ratings.map((rating) => (
                <p key={rating.id} className="text-gray-700">
                  <span className="font-bold">{`${rating.user.toUpperCase()}`}</span>
                  {` rated ${rating.stars}`}
                  <span className="text-yellow-500">★</span>
                </p>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4">Comment Section</h3>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment here"
              className="w-full p-2 border rounded mb-2 resize-none h-20"
            />
            <button
              onClick={handleCommentSubmit}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 duration-200 text-white rounded"
            >
              Comment
            </button>
            <div className="mt-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border rounded p-4 mb-4 shadow-sm"
                >
                  {editingCommentId === comment.id ? (
                    <>
                      <textarea
                        value={editingCommentText}
                        onChange={(e) => setEditingCommentText(e.target.value)}
                        className="w-full p-2 border rounded mb-2 h-20 resize-none"
                      />
                      <button
                        onClick={handleUpdateComment}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 duration-200 text-white rounded mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingCommentId(null)}
                        className="px-3 py-1 bg-gray-600 hover:bg-gray-700 duration-200 text-white rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-600 mb-2">{comment.text}</p>
                      <p className="text-sm text-gray-500">
                        Posted by: {comment.user} on{" "}
                        {new Date(comment.created_at).toLocaleDateString()}
                      </p>
                      {comment.user === currentUser && (
                        <>
                          <button
                            onClick={() =>
                              handleEditComment(comment.id, comment.text)
                            }
                            className="text-green-600 text-sm mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-red-500 text-sm"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SchoolDetails;
