import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import VideoResult from "../components/VideoResult";
import Head from "next/head";

export default function ResultsPage() {
  const router = useRouter();
  const { v } = router.query;
  const [data, setData] = useState(null);
  const [combinedComments, setCombinedComments] = useState([]);
  const [sentiRel, setSentiRel] = useState(null);
  const [sentiTime, setSentiTime] = useState(null);
  const [topLimit, setTopLimit] = useState(10);
  const [latestLimit, setLatestLimit] = useState(10);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWithRetry = async (url, maxAttempts = 5, delay = 2000) => {
    let attempts = 0;
    while (attempts < maxAttempts) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch data");
        return await response.json();
      } catch (err) {
        attempts++;
        if (attempts >= maxAttempts) {
          throw new Error("Failed to fetch data after multiple attempts");
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  };

  useEffect(() => {
    if (!v) return;
    const fetchData = async () => {
      try {
        const json = await fetchWithRetry(
          `https://analyseyoutube.onrender.com/results?v=${v}`
        );
        setData(json);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [v]);

  // Fetch comments sentiment for each type with its respective limit.
  useEffect(() => {
    if (!v) return;

    const fetchTopComments = async () => {
      try {
        const res = await fetch(
          `https://analyseyoutube.onrender.com/senti_comments?v=${v}&type=rel&limit=${topLimit}`
        );
        if (res.ok) {
          const json = await res.json();
          return json.comments;
        }
      } catch (err) {
        console.error("Error fetching Top comments:", err);
      }
      return [];
    };

    const fetchLatestComments = async () => {
      try {
        const res = await fetch(
          `https://analyseyoutube.onrender.com/senti_comments?v=${v}&type=time&limit=${latestLimit}`
        );
        if (res.ok) {
          const json = await res.json();
          return json.comments;
        }
      } catch (err) {
        console.error("Error fetching Latest comments:", err);
      }
      return [];
    };

    const fetchBoth = async () => {
      const topComments = await fetchTopComments();
      const latestComments = await fetchLatestComments();
      const combined = [
        ...topComments.map((item) => ({ ...item, type: "Top" })),
        ...latestComments.map((item) => ({ ...item, type: "Latest" })),
      ];
      setCombinedComments(combined);
    };

    fetchBoth();
  }, [v, topLimit, latestLimit]);

  // Fetch aggregated sentiment visualizations using combined comments.
  useEffect(() => {
    if (combinedComments.length === 0) return;
    const getVisualization = async (type, setter) => {
      // Filter combined comments by type and extract sentiment labels.
      const filtered = combinedComments
        .filter((item) => item.type === (type === "Top" ? "Top" : "Latest"))
        .map((item) => item.sentiment);
      try {
        const res = await fetch(
          "https://analyseyoutube.onrender.com/senti_visualization",
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
  // if (!data)
  if (loading)
    return (
      <Layout>
        <p>Loading video data...</p>
      </Layout>
    );

  return (
    <Layout>
      <Head>
        <title>{data["Title"] ? `${data["Title"]}` : "Video Analysis"}</title>
      </Head>
      {/* YouTube Iframe at the top */}
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

      <div className="flex justify-around mt-8">
        <div>
          <label className="mr-2">Top Comments Limit:</label>
          <select
            value={topLimit}
            onChange={(e) => setTopLimit(parseInt(e.target.value))}
            className="px-2 py-1 rounded bg-gray-800 text-white border border-gray-700"
          >
            {[10, 20, 40, 60, 80, 100].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mr-2">Latest Comments Limit:</label>
          <select
            value={latestLimit}
            onChange={(e) => setLatestLimit(parseInt(e.target.value))}
            className="px-2 py-1 rounded bg-gray-800 text-white border border-gray-700"
          >
            {[10, 20, 40, 60, 80, 100].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Layout>
  );
}
