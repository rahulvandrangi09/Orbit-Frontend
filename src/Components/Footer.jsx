import "./styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <p className="footer-title">For any queries, Contact Us</p>
          <div className="footer-links">
            <a href="#">Github</a>
            <a href="#">Mail</a>
            <a href="#">Linkedin</a>
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
