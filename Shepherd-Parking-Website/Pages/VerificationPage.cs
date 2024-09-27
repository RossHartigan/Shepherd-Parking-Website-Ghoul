using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;

namespace Shepherd_Parking_Website.Pages
{
    public class VerificationPage : PageModel
    {
        private readonly ILogger<VerificationPage> _logger;

        public VerificationPage(ILogger<VerificationPage> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {
        }
    }
}