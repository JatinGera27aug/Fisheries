import { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your API call or logic here
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1567005328098-64b0e4aa3d97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container-shadow w-full max-w-lg p-8 bg-white bg-opacity-90 shadow-lg rounded-xl">
        <h2 className="text-center my-3" style={{ color: "#2c7a7b" }}>
          Sign up here
        </h2>
        <div className="col-md-12 my-3 d-flex items-center justify-content-center">
          <div className="row">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label
                  htmlFor="username"
                  className="form-label"
                  style={{ color: "#2d3748" }}
                >
                  Name
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="form-control"
                  id="username"
                  placeholder="Enter your name"
                  required
                  style={{
                    borderColor: "#cbd5e0",
                    backgroundColor: "#edf2f7",
                  }}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="email"
                  className="form-label"
                  style={{ color: "#2d3748" }}
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                  id="email"
                  placeholder="Enter your email"
                  required
                  style={{
                    borderColor: "#cbd5e0",
                    backgroundColor: "#edf2f7",
                  }}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="password"
                  className="form-label"
                  style={{ color: "#2d3748" }}
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control"
                  id="password"
                  placeholder="Enter your password"
                  required
                  style={{
                    borderColor: "#cbd5e0",
                    backgroundColor: "#edf2f7",
                  }}
                />
              </div>
              <div className="mb-3">
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  style={{
                    backgroundColor: "#2c7a7b",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="font-medium" style={{ color: "#2c7a7b" }}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
