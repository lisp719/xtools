using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Net;

namespace xtools.Pages;

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
    public bool JapaneseOnly { get; set; } = true;
    public bool ExcludeReplies { get; set; }
    public bool FollowersOnly { get; set; }
    public string? Filter { get; set; }
    public string? Since { get; set; }
    public string? Until { get; set; }
  }

  public IActionResult OnPost(string query, SearchOptions options)
  {
    string url = "https://x.com/search?q=" + WebUtility.UrlEncode(query);
    if (options.JapaneseOnly) url += "%20lang:ja";
    if (options.ExcludeReplies) url += "%20-filter:replies";
    if (options.FollowersOnly) url += "%20filter:follows";
    if (!string.IsNullOrEmpty(options.Filter)) url += "%20" + options.Filter;
    if (!string.IsNullOrEmpty(options.Since)) url += "%20since:" + options.Since;
    if (!string.IsNullOrEmpty(options.Until)) url += "%20until:" + options.Until;
    url += "&f=live";
    return Redirect(url);
  }
}
