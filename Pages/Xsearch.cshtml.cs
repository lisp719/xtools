using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace xtools.Pages;

[IgnoreAntiforgeryToken]
public class XsearchModel : PageModel
{
    private readonly ILogger<XsearchModel> _logger;

    public XsearchModel(ILogger<XsearchModel> logger)
    {
        _logger = logger;
    }

    public void OnGet()
    {

    }

    public class SearchOptions
    {
        public bool JapaneseOnly { get; set; }
        public bool ExcludeReplies { get; set; }
        public bool FollowersOnly { get; set; }
        public string? Filter { get; set; }
        public string? CountType { get; set; }
        public string? CountValue { get; set; }
        public string? Since { get; set; }
        public string? Until { get; set; }
    }

    public IActionResult OnPost(string query, SearchOptions options)
    {
        // Defensive: ensure options is not null if model binding fails for some reason
        options ??= new SearchOptions();
        // Build search parts and join them with single spaces to avoid accidental
        // duplicate or leading/trailing spaces. Encode the whole q value once.
        var parts = new List<string>();

        // Query should appear last per request; add other options first and append query later.

        if (options.JapaneseOnly) parts.Add("lang:ja");
        if (options.ExcludeReplies) parts.Add("-filter:replies");
        if (options.FollowersOnly) parts.Add("filter:follows");
        if (!string.IsNullOrEmpty(options.Filter)) parts.Add(options.Filter);
        if (!string.IsNullOrEmpty(options.Since)) parts.Add("since:" + options.Since);
        if (!string.IsNullOrEmpty(options.Until)) parts.Add("until:" + options.Until);
        if (!string.IsNullOrEmpty(options.CountType) && !string.IsNullOrEmpty(options.CountValue))
            parts.Add(options.CountType + ":" + options.CountValue);

        if (!string.IsNullOrWhiteSpace(query))
        {
            parts.Add(query.Trim());
        }

        string q = string.Join(" ", parts);

        // Use EscapeDataString to get %20 for spaces which is appropriate in URLs
        string encoded = string.IsNullOrEmpty(q) ? string.Empty : Uri.EscapeDataString(q);

        string url = "https://x.com/search?q=" + encoded + "&f=live";

        return Redirect(url);
    }
}
