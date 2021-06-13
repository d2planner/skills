import './Footer.css';

function Footer (props) {
  return (
    <div className='footerContainer'>
      <hr/>
      <div className='footerContentContainer'>
        <div className='footerInfoContainer'>
          <p className='openSource'>An open source project (<a href='https://github.com/d2planner/d2planner'>view</a>).</p>
          <p className='copyRight'>© Copyright 2021, D2 Planner Developers</p>
        </div>
        <button className='reportIssue'>Report Issue</button>
      </div>
    </div>
  )
}

export default Footer;
