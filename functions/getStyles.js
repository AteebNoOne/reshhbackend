async function getStyles() {
    const styles = `
         <style>

.container {
  padding: 20px;
  background-color: #f5f5f5; /* Light gray background for content */
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); 
  font-family: Arial, sans-serif;
  margin: 0;
  background-color: #fff; 
}


h2 {
  color: #333; /* Dark gray for headings */
  margin: 10px 0;
}

p {
  color: #666; /* Light gray for text */
  line-height: 1.5;
}

.disclaimer {
  font-size: smaller;
  color: #999; /* Even lighter gray for disclaimer */
  text-align: center;
  margin-top: 20px;
}


a {
  color: #3b82f6; /* Blue-300 color for links */
  text-decoration: none; /* Remove underline from links */
}


a:hover {
  text-decoration: underline; /* Underline link on hover */
}

.logoImage{
  width:100px;
  height:100px;
}
</style>
    
    `

    return styles;
}


module.exports = getStyles;
