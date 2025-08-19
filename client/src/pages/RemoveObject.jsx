import { Scissors, Sparkles } from 'lucide-react';
import React, { useState } from 'react'
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  
  const [input, setInput] = useState("");
  const [object, setObject] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)

      if(object.split(' ').length > 1){
        return toast('Please enter only one object.')
      }

      const formData = new FormData()
      formData.append('image' , input)
      formData.append('object',object)

      const {data} = await axios.post(
        "/api/ai/remove-image-object",
        formData,
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false)
  };

  return (
    <div className="flex flex-wrap items-start h-full p-6 gap-4 overflow-y-scroll text-slate-700">
      {/* Left Column */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#4a7aff]" />
          <h1 className="text-xl font-semibold">Remove Objects</h1>
        </div>

        <p className="mt-6 text-sm font-medium">Upload Image</p>

        <input
          className="w-full p-2 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          required
          type="file"
          accept="image/*"
          onChange={(e) => setInput(e.target.files[0])}
        />

        <p className="mt-6 text-sm font-medium">
          Describe the object to remove
        </p>

        <textarea
          className="w-full p-2 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="Describe the object you want to remove ... , e.g., watch ,spoon"
          required
          rows={4}
          value={object}
          onChange={(e) => setObject(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#417df6] to-[#8e37eb] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer "
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Scissors className="w-5" />
          )}
          Remove Object
        </button>
      </form>
      {/* Right Coulmn */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96">
        <div className="flex items-center gap-3">
          <Scissors className="w-5 h-5 text-[#4a7aff]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Scissors className="w-9 h-9 " />
              <p>Upload an image and click "Remove Object" to get started.</p>
            </div>
          </div>
        ) : (
          <img src={content} alt="image" className="mt-3 h-full w-full" />
        )}
      </div>
    </div>
  );
}

export default RemoveObject;