import CommentsTable from "./CommentsTable";

export default function VideoResult({
  videoInfo,
  wordCloudRel,
  wordCloudTime,
  sentiRel,
  sentiTime,
  combinedComments,
}) {
  return (
    <div className="space-y-8">
      {/* Video Info Table */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Video Information</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-700">
            <thead>
              <tr className="bg-gray-800">
                <th className="px-4 py-2 text-left">Field</th>
                <th className="px-4 py-2 text-left">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {Object.entries(videoInfo).map(([key, value]) => {
                // Exclude keys not meant for display.
                if (
                  [
                    "wordCloud_rel",
                    "wordCloud_time",
                    "comments_rel",
                    "comments_time",
                    "senti_rel",
                    "senti_time",
                  ].includes(key)
                ) {
                  return null;
                }
                return (
                  <tr key={key}>
                    <td className="px-4 py-2 border-r border-gray-700">
                      {key}
                    </td>
                    <td className="px-4 py-2">{value}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Word Clouds */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Top Comments Word Cloud
          </h2>
          {wordCloudRel ? (
            <img
              src={`data:image/png;base64,${wordCloudRel}`}
              alt="Word Cloud Relevance"
              className="mx-auto rounded shadow-lg"
            />
          ) : (
            <div className="flex justify-center items-center h-40">
              <div className="loader" />
            </div>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Latest Comments Word Cloud
          </h2>
          {wordCloudTime ? (
            <img
              src={`data:image/png;base64,${wordCloudTime}`}
              alt="Word Cloud Time"
              className="mx-auto rounded shadow-lg"
            />
          ) : (
            <div className="flex justify-center items-center h-40">
              <div className="loader" />
            </div>
          )}
        </div>
      </div>

      {/* Sentiment Visualizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Top Comments Sentiment
          </h2>
          {sentiRel ? (
            <img
              src={`data:image/png;base64,${sentiRel}`}
              alt="Sentiment Relevance"
              className="mx-auto rounded shadow-lg"
            />
          ) : (
            <div className="flex justify-center items-center h-40">
              <div className="loader" />
            </div>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Latest Comments Sentiment
          </h2>
          {sentiTime ? (
            <img
              src={`data:image/png;base64,${sentiTime}`}
              alt="Sentiment Time"
              className="mx-auto rounded shadow-lg"
            />
          ) : (
            <div className="flex justify-center items-center h-40">
              <div className="loader" />
            </div>
          )}
        </div>
      </div>
      <CommentsTable comments={combinedComments} />
    </div>
  );
}
