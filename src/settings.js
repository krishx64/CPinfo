import { useState, useEffect } from "react";
import axios from "axios";

export default function Settings() {
  const [resources, setResources] = useState([]);
  const [handleName, setHandleName] = useState({
    cf: "",
    cc: "",
    ac: "",
    lc: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:3000/resources")
      .then((response) => setResources(response.data))
      .catch((error) => console.error("Error fetching data", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHandleName({ ...handleName, [name]: value });
  };
  useEffect(() => {
    console.log(resources);
    let newHandleName = { ...handleName };
    resources.forEach((resource) => {
      if (resource.name === "Atcoder") {
        newHandleName.ac = resource.handle;
      }
      if (resource.name === "Codeforces") {
        newHandleName.cf = resource.handle;
      }
      if (resource.name === "Codechef") {
        newHandleName.cc = resource.handle;
      }
      if (resource.name === "Leetcode") {
        newHandleName.lc = resource.handle;
      }
    });
    setHandleName(newHandleName);
  }, [resources]);
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    try {
      const response = await axios.post(
        "http://localhost:3000/api/fetch",
        handleName
      );
      console.log("Form submitted successfully:", response.data);
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error.message);
      alert("Error submitting form. Please try again.");
    }
  };

  return (
    <form className="My-Form" onSubmit={handleSubmit}>
      <div>
        <label>
          Enter Codeforces handle:
          <input
            type="text"
            name="cf"
            value={handleName.cf}
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <label>
          Enter Atcoder handle:
          <input
            type="text"
            name="ac"
            value={handleName.ac}
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <label>
          Enter Leetcode handle:
          <input
            type="text"
            name="lc"
            value={handleName.lc}
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <label>
          Enter Codechef handle:
          <input
            type="text"
            name="cc"
            value={handleName.cc}
            onChange={handleChange}
          />
        </label>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
