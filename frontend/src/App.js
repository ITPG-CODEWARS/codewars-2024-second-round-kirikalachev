import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import QRCode from "react-qr-code";
import './App.css';

import RightArrowIcon from './right-arrow.svg';
import LoginIcon from './login-icon.svg';
import ChevronDownIcon from './chevron-down.svg';
import CopyIcon from './copy-icon.svg';
import DownloadIcon from './download-icon.svg';

const App = () => {
  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [shortenedUrls, setShortenedUrls] = useState([]);
  const [editUrl, setEditUrl] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null); 

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await axios.get("http://localhost:5000/shortened-urls");
        setShortenedUrls(response.data);
      } catch (err) {
        console.error("Error loading shortened URLs", err);
      }
    };

    fetchUrls();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/shorten", { fullUrl: url });
      setShortenedUrl(`http://localhost:5000/${response.data.shortUrl}`);
      setShortenedUrls(prevUrls => [...prevUrls, response.data]);
    } catch (err) {
      console.error("Error shortening URL", err);
    }
  };

  const deleteShortUrl = async (shortUrl) => {
    try {
      const response = await axios.delete(`http://localhost:5000/shortened-urls/${shortUrl}`);
      setShortenedUrls(prevUrls => prevUrls.filter(url => url.shortUrl !== shortUrl));
      console.log(response.data);
    } catch (error) {
      console.error("Error deleting URL:", error.response?.data || error.message);
    }
  };

  const handleEdit = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/shortened-urls/${editUrl.shortUrl}`, {
        fullUrl: editUrl.fullUrl,
        newShortUrl: editUrl.newShortUrl
      });

      setShortenedUrls(prevUrls => 
        prevUrls.map(url => url.shortUrl === editUrl.shortUrl ? response.data.updatedUrl : url)
      );
      setEditUrl(null);
    } catch (error) {
      console.error("Error updating URL:", error.response?.data || error.message);
    }
  };

  const handleCopyToClipboard = (url) => {
    navigator.clipboard.writeText(url)
      .then(() => {
        alert("URL copied to clipboard!");
      })
      .catch(err => {
        console.error("Failed to copy URL to clipboard: ", err);
      });
  };

  const qrRef = useRef(null);

  const handleDownloadQR = () => {
    const svg = qrRef.current;
    
    if (!svg) {
      console.error("QR code SVG not found");
      return;
    }
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngFile;
      downloadLink.download = "QRCode.png";
      downloadLink.click();
    };
    
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };
  

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index); 
  };

  return (
    <div className="App">
      <header>
        <h1>Linker</h1>
        <button>
          Login
          <img src={LoginIcon} alt=" " />
        </button>
      </header>

      <div className="slogan">
        <h2>Shorten links, extend possibilities.</h2>
        <p>Create custom, shortened URLs for a cleaner and more efficient web experience.</p>
      </div>

      <form onSubmit={handleSubmit} className="url-shortener">
        <input
          type="url"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit"><img src={RightArrowIcon} alt="Shorten" /></button>
      </form>

      {shortenedUrl && (
        <div className="shortened-url">
          <h3>Shortened URL:</h3>
            <a href={shortenedUrl} target="_blank" rel="noopener noreferrer">
              {shortenedUrl}
            </a>
          <button onClick={() => handleCopyToClipboard(shortenedUrl)}><img src={CopyIcon} alt="Copy link" title="Copy to clipboard"></img></button>
        </div>
      )}

      <div className="shortened-links">
        <h3>Shortened Links</h3>
        <ul>
          {shortenedUrls.map((item, index) => (
            <li key={index} className="shortened-link-component">              
              <div className="short-url">
                <a href={`http://localhost:5000/${item.shortUrl}`} target="_blank" rel="noopener noreferrer">
                  http://localhost:5000/{item.shortUrl}
                </a>
                <button onClick={() => handleCopyToClipboard(`http://localhost:5000/${item.shortUrl}`)} title="Copy to clipboard"><img src={CopyIcon} alt="Copy link"></img></button>
              </div>

              <div className="link-btns">
                <QRCode className="qr-code m" value={`http://localhost:5000/${item.shortUrl}`} ref={qrRef} bgColor="transparent" fgColor="#FFFFFF"/>
                <button onClick={handleDownloadQR} className="link-btn m"><img src={DownloadIcon} alt="Download Qr Code" title="Download QR Code"></img></button>
                <button onClick={() => setEditUrl({ ...item })} className="link-btn m">Customize</button>
                <button onClick={() => deleteShortUrl(item.shortUrl)} className="link-btn m">Delete</button>
                <button onClick={() => toggleExpand(index)} className={`expandBtn ${expandedIndex === index ? "open" : ""}`}><img src={ChevronDownIcon} alt="Expand"></img></button>
              </div>

              <div className={`chevron-down-content ${expandedIndex === index ? "open" : ""}`}>
                <QRCode className="qr-code" value={`http://localhost:5000/${item.shortUrl}`} ref={qrRef} bgColor="transparent" fgColor="#FFFFFF"/>
                <button onClick={handleDownloadQR} className="link-btn"><img src={DownloadIcon} alt="Download Qr Code" title="Download QR Code"></img></button>
                <button onClick={() => setEditUrl({ ...item })} className="link-btn">Customize</button>
                <button onClick={() => deleteShortUrl(item.shortUrl)} className="link-btn">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {editUrl && (
        <div className="edit-url">
          <h3>Edit URL</h3>
          <input
            type="url"
            value={editUrl.fullUrl}
            onChange={(e) => setEditUrl({ ...editUrl, fullUrl: e.target.value })}
            disabled
          />
          <input
            type="text"
            placeholder="New short URL"
            value={editUrl.newShortUrl}
            onChange={(e) => setEditUrl({ ...editUrl, newShortUrl: e.target.value })}
          />
          <button onClick={() => setEditUrl(null)} className="close-btn">Close</button> 
          <button onClick={handleEdit}>Save Changes</button>
        </div>
      )}
    </div>
  );
};

export default App;
