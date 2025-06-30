import React, { useEffect, useState } from 'react';
import { getFooterHTML } from '../helpers';

const FooterBar = () => {
  const [footer, setFooter] = useState(getFooterHTML());
  let remainCheckTimes = 5;

  const loadFooter = () => {
    let footer_html = localStorage.getItem('footer_html');
    if (footer_html) {
      setFooter(footer_html);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (remainCheckTimes <= 0) {
        clearInterval(timer);
        return;
      }
      remainCheckTimes--;
      loadFooter();
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const PoweredByBadge = (
    <a href={`https://the.veloera.org/landing?utm_source=${window.location.hostname}&utm_campaign=footer_badage`} target='_blank' rel='noreferrer'>
      <img src='/powered_by.svg' alt='Powered by Veloera' style={{ height: '30px', verticalAlign: 'middle' }} />
    </a>
  );

  let content;
  if (footer) {
    const isMultiLine = footer.includes('<p') || footer.includes('<div') || footer.includes('<br');
    if (isMultiLine) {
      content = (
        <>
          <div className='custom-footer' dangerouslySetInnerHTML={{ __html: footer }}></div>
          <div style={{ marginTop: '5px' }}>{PoweredByBadge}</div>
        </>
      );
    } else {
      content = (
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <div className='custom-footer' style={{display: 'inline-block'}} dangerouslySetInnerHTML={{ __html: footer }}></div>
          {PoweredByBadge}
        </div>
      );
    }
  } else {
    content = PoweredByBadge;
  }

  return (
    <div style={{ textAlign: 'center', paddingBottom: '5px' }}>
      {content}
    </div>
  );
};

export default FooterBar;