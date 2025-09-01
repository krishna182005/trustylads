import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Ruler, Shirt, Watch, Gem } from 'lucide-react';

const SizeGuidePage: React.FC = () => {
  // Scroll to top when page loads
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center space-x-2">
              <Ruler className="h-6 w-6 text-yellow-600" />
              <h1 className="text-2xl font-bold text-gray-900">Size Guide</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="prose prose-lg max-w-none">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">TrustyLads Size Guide</h2>
              <p className="text-gray-600">
                Find your perfect fit with our comprehensive size guide. We offer a wide range of sizes to ensure 
                you get the best fit for your style and comfort.
              </p>
            </div>

            <div className="space-y-8">
              {/* Shirts Size Guide */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shirt className="h-5 w-5 mr-2 text-yellow-600" />
                  Shirts & T-Shirts
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">Size</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">Chest (inches)</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">Length (inches)</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">Shoulder (inches)</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">Fit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-900">S</td>
                        <td className="px-4 py-3 text-sm text-gray-600">36-38</td>
                        <td className="px-4 py-3 text-sm text-gray-600">26-27</td>
                        <td className="px-4 py-3 text-sm text-gray-600">16-17</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Regular</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-900">M</td>
                        <td className="px-4 py-3 text-sm text-gray-600">38-40</td>
                        <td className="px-4 py-3 text-sm text-gray-600">27-28</td>
                        <td className="px-4 py-3 text-sm text-gray-600">17-18</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Regular</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-900">L</td>
                        <td className="px-4 py-3 text-sm text-gray-600">40-42</td>
                        <td className="px-4 py-3 text-sm text-gray-600">28-29</td>
                        <td className="px-4 py-3 text-sm text-gray-600">18-19</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Regular</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-900">XL</td>
                        <td className="px-4 py-3 text-sm text-gray-600">42-44</td>
                        <td className="px-4 py-3 text-sm text-gray-600">29-30</td>
                        <td className="px-4 py-3 text-sm text-gray-600">19-20</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Regular</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-900">XXL</td>
                        <td className="px-4 py-3 text-sm text-gray-600">44-46</td>
                        <td className="px-4 py-3 text-sm text-gray-600">30-31</td>
                        <td className="px-4 py-3 text-sm text-gray-600">20-21</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Regular</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Watches Size Guide */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Watch className="h-5 w-5 mr-2 text-yellow-600" />
                  Watches
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">Case Size</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">Band Width</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">Wrist Size</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">Style</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-900">36mm</td>
                        <td className="px-4 py-3 text-sm text-gray-600">18mm</td>
                        <td className="px-4 py-3 text-sm text-gray-600">6-7 inches</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Classic</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-900">40mm</td>
                        <td className="px-4 py-3 text-sm text-gray-600">20mm</td>
                        <td className="px-4 py-3 text-sm text-gray-600">6.5-7.5 inches</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Modern</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-900">42mm</td>
                        <td className="px-4 py-3 text-sm text-gray-600">22mm</td>
                        <td className="px-4 py-3 text-sm text-gray-600">7-8 inches</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Sport</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-900">44mm</td>
                        <td className="px-4 py-3 text-sm text-gray-600">24mm</td>
                        <td className="px-4 py-3 text-sm text-gray-600">7.5-8.5 inches</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Large</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Jewelry Size Guide */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Gem className="h-5 w-5 mr-2 text-yellow-600" />
                  Jewelry
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Rings</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">US Size</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">UK Size</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">Diameter (mm)</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">Circumference (mm)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-900">7</td>
                            <td className="px-4 py-3 text-sm text-gray-600">O</td>
                            <td className="px-4 py-3 text-sm text-gray-600">17.3</td>
                            <td className="px-4 py-3 text-sm text-gray-600">54.4</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-900">8</td>
                            <td className="px-4 py-3 text-sm text-gray-600">P</td>
                            <td className="px-4 py-3 text-sm text-gray-600">18.2</td>
                            <td className="px-4 py-3 text-sm text-gray-600">57.1</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-900">9</td>
                            <td className="px-4 py-3 text-sm text-gray-600">Q</td>
                            <td className="px-4 py-3 text-sm text-gray-600">19.0</td>
                            <td className="px-4 py-3 text-sm text-gray-600">59.7</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-900">10</td>
                            <td className="px-4 py-3 text-sm text-gray-600">R</td>
                            <td className="px-4 py-3 text-sm text-gray-600">19.8</td>
                            <td className="px-4 py-3 text-sm text-gray-600">62.3</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Bracelets</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">Size</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">Length (inches)</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">Wrist Size</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-900">Small</td>
                            <td className="px-4 py-3 text-sm text-gray-600">7</td>
                            <td className="px-4 py-3 text-sm text-gray-600">6-6.5 inches</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-900">Medium</td>
                            <td className="px-4 py-3 text-sm text-gray-600">7.5</td>
                            <td className="px-4 py-3 text-sm text-gray-600">6.5-7 inches</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-900">Large</td>
                            <td className="px-4 py-3 text-sm text-gray-600">8</td>
                            <td className="px-4 py-3 text-sm text-gray-600">7-7.5 inches</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-900">X-Large</td>
                            <td className="px-4 py-3 text-sm text-gray-600">8.5</td>
                            <td className="px-4 py-3 text-sm text-gray-600">7.5+ inches</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </section>

              {/* How to Measure */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Measure</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">For Shirts & T-Shirts</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <strong>Chest:</strong> Measure around the fullest part of your chest</li>
                      <li>• <strong>Length:</strong> Measure from shoulder to desired length</li>
                      <li>• <strong>Shoulder:</strong> Measure across the back from shoulder to shoulder</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">For Watches</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <strong>Wrist:</strong> Measure around your wrist bone</li>
                      <li>• <strong>Case Size:</strong> Consider your wrist size and style preference</li>
                      <li>• <strong>Band:</strong> Ensure the band fits comfortably</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">For Rings</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <strong>Finger:</strong> Measure the circumference of your finger</li>
                      <li>• <strong>Time:</strong> Measure when your fingers are at normal temperature</li>
                      <li>• <strong>Fit:</strong> Ring should slide over knuckle but not fall off</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">For Bracelets</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <strong>Wrist:</strong> Measure around your wrist bone</li>
                      <li>• <strong>Fit:</strong> Add 0.5-1 inch for comfortable fit</li>
                      <li>• <strong>Style:</strong> Consider if you prefer loose or snug fit</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Tips */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Size Tips</h3>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Ruler className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-yellow-800 font-medium">Getting the Right Fit</h4>
                      <div className="mt-2 text-yellow-700 text-sm">
                        <ul className="space-y-1">
                          <li>• Always measure yourself before ordering</li>
                          <li>• Consider your preferred fit (slim, regular, loose)</li>
                          <li>• For jewelry, measure when your body is at normal temperature</li>
                          <li>• When in doubt, size up rather than down</li>
                          <li>• Check our return policy if you need to exchange sizes</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Contact */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help with Sizing?</h3>
                <div className="space-y-3 text-gray-600">
                  <p>If you're unsure about your size or need assistance, our customer support team is here to help:</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>TrustyLads Customer Support</strong></p>
                    <p>Chennai, Tamil Nadu, India</p>
                    <p>Email: <a href="mailto:trustylads@gmail.com" className="text-yellow-600 hover:text-yellow-700">trustylads@gmail.com</a></p>
                    <p>WhatsApp: <a href="https://wa.me/916369360104" className="text-yellow-600 hover:text-yellow-700">+91 6369360104</a></p>
                    <p>Instagram: <a href="https://www.instagram.com/trustylads?igsh=MTRraWIwdGM3eWVsMw==" className="text-yellow-600 hover:text-yellow-700" target="_blank" rel="noopener noreferrer">@trustylads</a></p>
                    <p>Facebook: <a href="https://www.facebook.com/share/16NDSH4AmT/" className="text-yellow-600 hover:text-yellow-700" target="_blank" rel="noopener noreferrer">TrustyLads</a></p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeGuidePage;
