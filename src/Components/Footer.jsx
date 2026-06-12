import "./styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <p className="footer-title">For any queries, Contact Us</p>
          <div className="footer-links">
            <a href="https://github.com/rahulvandrangi09" target="_blank" rel="noopener noreferrer">Github</a>
            <a href="mailto:rahulvandrangi1k@gmail.com">Mail</a>
            <a href="https://www.linkedin.com/in/vandrangi-rahul/" target="_blank" rel="noopener noreferrer">Linkedin</a>
          </div>
        </div>
        <div className="footer-right">
          <p className="footer-title">Have A Nice Day XD</p>
          <p className="copyright">&copy; All Rights Reserved, Team Orbit</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
