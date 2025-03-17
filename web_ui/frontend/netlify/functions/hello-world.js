// Example Netlify serverless function
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello from AIHawk Jobs Applier API!" }),
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*" // For development
    }
  };
};
