# Email Rendering API

This API provides endpoints to render React Email templates as HTML for consumption by the .NET backend.

## Authentication

All endpoints require an API key passed in the `x-api-key` header. Set the `EMAIL_API_KEY` environment variable in your `.env.local` file.

```env
EMAIL_API_KEY=your-secure-api-key-here
```

## Available Endpoints

### 1. Invoice Email
**GET** `/api/email/invoice`

Query Parameters:
- `tenantName` (string, optional) - Tenant's full name
- `propertyAddress` (string, optional) - Property address
- `invoiceNumber` (string, optional) - Invoice number (e.g., "INV-001")
- `invoiceDate` (string, optional) - Invoice date
- `dueDate` (string, optional) - Payment due date
- `amount` (string, optional) - Total amount (e.g., "$1,500.00")
- `paymentUrl` (string, optional) - Payment portal URL
- `items` (JSON string, optional) - Array of invoice items

**POST** `/api/email/invoice`

Request Body:
```json
{
  "tenantName": "John Doe",
  "propertyAddress": "123 Main St, Apt 4B",
  "invoiceNumber": "INV-001",
  "invoiceDate": "2025-11-26",
  "dueDate": "2025-12-10",
  "amount": "$1,500.00",
  "items": [
    { "description": "Monthly Rent", "amount": "$1,500.00" }
  ],
  "paymentUrl": "https://app.example.com/payments/123"
}
```

### 2. Welcome Email
**GET** `/api/email/welcome`

Query Parameters:
- `userFirstname` (string, optional)
- `loginUrl` (string, optional)

**POST** `/api/email/welcome`

Request Body:
```json
{
  "userFirstname": "John",
  "loginUrl": "https://app.example.com/signin"
}
```

### 3. Reset Password Email
**GET** `/api/email/reset-password`

Query Parameters:
- `userFirstname` (string, optional)
- `resetPasswordUrl` (string, optional)

**POST** `/api/email/reset-password`

Request Body:
```json
{
  "userFirstname": "John",
  "resetPasswordUrl": "https://app.example.com/reset-password?token=abc123"
}
```

### 4. Invitation Email
**GET** `/api/email/invitation`

Query Parameters:
- `inviterName` (string, optional)
- `organizationName` (string, optional)
- `invitationUrl` (string, optional)
- `role` (string, optional)

**POST** `/api/email/invitation`

Request Body:
```json
{
  "inviterName": "Jane Smith",
  "organizationName": "Acme Properties",
  "invitationUrl": "https://app.example.com/invitations/token123",
  "role": "member"
}
```

## Usage from .NET

### Example using HttpClient (GET):

```csharp
using System.Net.Http;
using System.Threading.Tasks;

public class EmailService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly string _nextJsBaseUrl;

    public EmailService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _apiKey = configuration["EmailApi:ApiKey"];
        _nextJsBaseUrl = configuration["EmailApi:BaseUrl"];
    }

    public async Task<string> GetInvoiceEmailHtml(string tenantName, string amount, string invoiceNumber)
    {
        var url = $"{_nextJsBaseUrl}/api/email/invoice?tenantName={Uri.EscapeDataString(tenantName)}&amount={Uri.EscapeDataString(amount)}&invoiceNumber={Uri.EscapeDataString(invoiceNumber)}";
        
        var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Add("x-api-key", _apiKey);
        
        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
        
        return await response.Content.ReadAsStringAsync();
    }
}
```

### Example using HttpClient (POST):

```csharp
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

public async Task<string> GetInvoiceEmailHtmlPost(InvoiceData data)
{
    var url = $"{_nextJsBaseUrl}/api/email/invoice";
    
    var request = new HttpRequestMessage(HttpMethod.Post, url);
    request.Headers.Add("x-api-key", _apiKey);
    
    var jsonContent = JsonSerializer.Serialize(data);
    request.Content = new StringContent(jsonContent, Encoding.UTF8, "application/json");
    
    var response = await _httpClient.SendAsync(request);
    response.EnsureSuccessStatusCode();
    
    return await response.Content.ReadAsStringAsync();
}
```

### Sending with Resend:

```csharp
using Resend;

public async Task SendInvoiceEmail(string tenantEmail, string tenantName, string amount, string invoiceNumber)
{
    // 1. Get HTML from Next.js
    var htmlContent = await GetInvoiceEmailHtml(tenantName, amount, invoiceNumber);
    
    // 2. Send via Resend
    var resend = new ResendClient("your-resend-api-key");
    
    var message = new EmailMessage
    {
        From = "noreply@yourdomain.com",
        To = new[] { tenantEmail },
        Subject = $"Invoice {invoiceNumber}",
        HtmlBody = htmlContent
    };
    
    await resend.EmailSendAsync(message);
}
```

## Response Format

All endpoints return HTML content with `Content-Type: text/html` on success.

Error responses return JSON:
```json
{
  "error": "Error message"
}
```

## Status Codes

- `200` - Success (HTML returned)
- `401` - Unauthorized (invalid or missing API key)
- `500` - Internal server error (template rendering failed)

## Testing

You can test the endpoints using curl:

```bash
curl -H "x-api-key: your-api-key" \
  "http://localhost:3000/api/email/invoice?tenantName=John%20Doe&amount=$1,500.00&invoiceNumber=INV-001"
```

Or using Postman/Insomnia with the appropriate headers and parameters.
