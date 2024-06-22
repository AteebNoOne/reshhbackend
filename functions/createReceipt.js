const fs = require('fs');
const path = require('path');

async function createReceipt(name, receiptData) {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Receipt from Reshh Properties</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f0f0f0;
          padding: 20px;
        }
        .receipt-container {
          max-width: 350px;
          margin: 0 auto; /* Center the receipt */
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          background-color: #edf2f7;
          padding: 20px;
        }
        .receipt-content {
          width: 100%; /* Ensure full width */
          text-align: left;
          color: #4a5568;
          font-size: 16px;
        }
        .receipt-item {
          margin-bottom: 10px;
        }
        .receipt-item span {
          display: block;
          margin-top: 5px; /* Adjust spacing between spans */
        }
      </style>
    </head>
    <body>
      <h2 style="text-align: center; margin-bottom: 20px;">Receipt for #${name}</h2>
      <div class="receipt-container">
        <div class="receipt-content">
          <div class="receipt-item">
            <b>Total before taxes:</b>
            <span>$${receiptData.totalBeforeTaxes}</span>
          </div>
  
          <div class="receipt-item">
            <b>$${receiptData.nightPrice} x ${receiptData.numNights} nights:</b>
            <span>$${receiptData.nightPrice * receiptData.numNights}</span>
          </div>
  
          <div class="receipt-item">
            <b>Cleaning fee:</b>
            <span>$${receiptData.cleaningFee}</span>
          </div>
  
          <div class="receipt-item">
            <b>Property management fee:</b>
            <span>$${receiptData.propertyManagementfee}</span>
          </div>
  
          <div class="receipt-item">
            <b>Admin management fee:</b>
            <span>$${receiptData.adminFee}</span>
          </div>
  
          <div class="receipt-item">
            <b>Discount:</b>
            <span>${receiptData.discount}%</span>
          </div>
  
        </div>
      </div>
    </body>
    </html>
  `;

  // Create file path and write the HTML file
  const directoryPath = path.join(__dirname, '..', 'dist', 'receipts');
  const filePath = path.join(directoryPath, `${name}.html`);

  // Ensure the receipts directory exists, if not, create it
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  // Write the HTML content to the file
  fs.writeFileSync(filePath, htmlContent);

  console.log(`Created receipt file for ${name} at ${filePath}`);
  
  // Return the HTML content
  return htmlContent;
}

module.exports = {
  createReceipt
};
