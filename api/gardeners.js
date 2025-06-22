

export default function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*"); 
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); 
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
   
    return res.status(200).end();
  }

  
  const gardeners = [
    {
      _id: 1,
      name: "John Doe",
      image: "/john.jpg",
      age: 30,
      gender: "Male",
      status: "Available",
      experience: "5 years",
      totalTips: 10,
    },
    {
      _id: 2,
      name: "Jane Doe",
      image: "/jane.jpg",
      age: 28,
      gender: "Female",
      status: "Available",
      experience: "3 years",
      totalTips: 8,
    },
   
  ];

  
  res.status(200).json(gardeners);
}
