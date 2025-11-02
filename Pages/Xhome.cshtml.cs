using System.Net;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace MyApp.Namespace
{
    public class XhomeModel : PageModel
    {
        public void OnGet()
        {
        }

        public class SearchOptions
        {
            public string? Filter { get; set; }
            public string? Until { get; set; }
        }

        public IActionResult OnPost(SearchOptions options)
        {
            string url = "https://x.com/search?q=-filter:replies";
            if (!string.IsNullOrEmpty(options.Filter)) url += "%20" + options.Filter;
            if (!string.IsNullOrEmpty(options.Until)) url += "%20until:" + options.Until;
            url += "&f=live&pf=on";
            return Redirect(url);
        }
    }
}
