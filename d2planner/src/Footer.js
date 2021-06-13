import './Footer.css';

function Footer (props) {
  function sendEmail () {
    window.open("mailto:d2plannerissues@gmail.com?subject=Report%20Issue");
  }

  return (
    <div className='footerContainer'>
      <hr/>
      <div className='footerContentContainer'>
        <div className='footerInfoContainer'>
          <p className='openSource'>An open source project (<a href='https://github.com/d2planner/skills'>view</a>).</p>
          <p className='copyRight'>© Copyright 2021, D2 Planner Developers</p>
        </div>
        <button
          className='reportIssue'
          onClick={sendEmail}
        >
        Report Issue
        </button>
      </div>
    </div>
  )
}

export default Footer;
