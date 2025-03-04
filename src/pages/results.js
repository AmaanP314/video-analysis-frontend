import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import VideoResult from "../components/VideoResult";

export default function ResultsPage() {
  const router = useRouter();
  const { v } = router.query;
  const [data, setData] = useState(null);
  const [combinedComments, setCombinedComments] = useState([]);
  const [sentiRel, setSentiRel] = useState(null);
  const [sentiTime, setSentiTime] = useState(null);
  const [error, setError] = useState(null);

  // Fetch stored video data.
  useEffect(() => {
    if (!v) return;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://analyseyoutube.onrender.com/results?v=${v}`
        );
        if (!response.ok) throw new Error("Failed to fetch video data");
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [v]);

  // Fetch combined comments with individual sentiment labels for both types.
  useEffect(() => {
    if (!v) return;

    const fetchCommentsSentiments = async (type) => {
      try {
        const res = await fetch(
          `https://analyseyoutube.onrender.com/senti_comments?v=${v}&type=${type}`
        );
        if (res.ok) {
          const json = await res.json();
          return json.comments;
        }
      } catch (err) {
        console.error(`Sentiment (${type}) error:`, err);
      }
      return [];
    };

    const fetchBoth = async () => {
      const relComments = await fetchCommentsSentiments("rel");
      const timeComments = await fetchCommentsSentiments("time");
      const combined = [
        ...relComments.map((item) => ({ ...item, type: "Top" })),
        ...timeComments.map((item) => ({ ...item, type: "Latest" })),
      ];
      setCombinedComments(combined);
    };

    fetchBoth();
  }, [v]);

  useEffect(() => {
    if (combinedComments.length === 0) return;

    const getVisualization = async (type, setter) => {
      const filtered = combinedComments
        .filter((item) => item.type === (type === "Top" ? "Top" : "Latest"))
        .map((item) => item.sentiment);
      try {
        const res = await fetch(
          "https://analyseyoutube.onrender.com/senti_visualization_from_labels",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sentiment_labels: filtered }),
          }
        );
        if (res.ok) {
          const json = await res.json();
          setter(json.sentiment);
        }
      } catch (err) {
        console.error(`Error fetching visualization for ${type}:`, err);
      }
    };

    getVisualization("Top", setSentiRel);
    getVisualization("Latest", setSentiTime);
  }, [combinedComments]);

  if (error)
    return (
      <Layout>
        <p className="text-red-500">{error}</p>
      </Layout>
    );
  if (!data)
    return (
      <Layout>
        <p>Loading video data...</p>
      </Layout>
    );

  return (
    <Layout>
      <div className="w-full aspect-video mb-8">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${v}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube Video Player"
        ></iframe>
      </div>
      <VideoResult
        videoInfo={data}
        wordCloudRel={data.wordCloud_rel}
        wordCloudTime={data.wordCloud_time}
        sentiRel={sentiRel}
        sentiTime={sentiTime}
        combinedComments={combinedComments}
      />
    </Layout>
  );
}
