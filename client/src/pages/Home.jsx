import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>ATS Resume Analyzer</h1>
        <p>Improve your resume with AI-powered insights</p>
        <button className="cta-button" onClick={() => navigate("/upload")}>
          Upload Your Resume
        </button>
      </div>

      <div className="feature-grid">
        <div className="feature-card">
          <div className="feature-icon">📄</div>
          <h3>Upload Resume</h3>
          <p>Upload your PDF resume and extract key information instantly</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h3>ATS Score</h3>
          <p>Get compatibility score based on job requirements</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🤖</div>
          <h3>AI Suggestions</h3>
          <p>Improve your resume with smart AI recommendations</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Skill Analysis</h3>
          <p>See missing skills compared to job description</p>
        </div>
      </div>
    </div>
  );
};

export default Home;