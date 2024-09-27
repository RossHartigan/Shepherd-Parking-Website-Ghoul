using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;

namespace Shepherd_Parking_Website.Pages
{
    public class AboutUs : PageModel
    {
        private readonly ILogger<AboutUs> _logger;

        public AboutUs(ILogger<AboutUs> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {
        }
    }
}