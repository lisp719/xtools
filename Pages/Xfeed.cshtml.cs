using Microsoft.AspNetCore.Mvc.RazorPages;

namespace xtools.Pages;

public class XfeedModel : PageModel
{
    public void OnGet()
    {
        Response.Redirect("https://x.com/search?q=-filter:replies&f=live&pf=on");
    }
}
