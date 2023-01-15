# Things2Do
Minimize time spent planning and maximize having fun with Things2Do!

## Inspiration
The idea for Things2Do came from the difficulties that we experienced when planning events with friends. Planning events often involve venue selection which can be a time-consuming, tedious process. Our search for solutions online yielded websites like Google Maps, Yelp, and TripAdvisor, but each fell short of our needs and often had complicated filters or cluttered interfaces. More importantly, we were unable to find event planning that accounts for the total duration of an outing event and much less when it came to scheduling multiple visits to venues accounting for travel time. This inspired us to create Things2Do which minimizes time spent planning and maximizes time spent at meaningful locations for a variety of preferences on a tight schedule. Now, there's always something to do with Things2Do!

## What it does
Share quality experiences with people that you enjoy spending time with. Things2Do provides the top 3 suggested venues to visit given constraints of the time spent at each venue, distance, and select category of place to go. Furthermore, the requirements surrounding the duration of a complete event plan across multiple venues can become increasingly complex when trying to account for the tight schedules of attendees, a wide variety of preferences, and travel time between multiple venues throughout the duration of an event. 

## How we built it
The functionality of Things2Do is powered by various APIs to retrieve the details of venues and spatiotemporal analysis with React for the front end, and express.js/node.js for the backend functionality.

APIs:
- openrouteservice to calculate travel time
- Geoapify for location search autocomplete and geocoding
- Yelp to retrieve names, addresses, distances, and ratings of venues

Languages, tools, and frameworks:
- JavaScript for compatibility with React, express.js/node.js, Verbwire, and other APIs
- Express.js/node.js backend server
- TailwindCSS for styling React components

Other services:
- Verbwire to mint NFTs (for memories!) from event pictures

## Challenges we ran into
Initially, we wanted to use Google Maps API to find locations of venues but these features were not part of the free tier and even if we were to implement these ourselves it would still put us at risk of spending more than the free tier would allow. This resulted in us switching to node.js for the backend to work with JavaScript for better support for the open-source APIs that we used. We also struggled to find a free geocoding service so we settled for Geoapify which is open-source. JavaScript was also used so that Verbwire could be used to mint NFTs based on images from the event. Researching all of these new APIs and scouring documentation to determine if they fulfilled the desired functionality that we wanted to achieve with Things2Do was an enormous task since we never had experience with them before and were forced to do so for compatibility with the other services that we were using. Finally, we underestimated the time it would take to integrate the front-end to the back-end and add the NFT minting functionality on top of debugging. 

A challenge we also faced was coming up with an optimal method of computing an optimal event plan in consideration of all required parameters. This involved looking into algorithms like the Travelling Salesman, Dijkstra's and A*.   

## Accomplishments that we're proud of
Our team is most proud of meeting all of the goals that we set for ourselves coming into this hackathon and tackling this project. Our goals consisted of learning how to integrate front-end and back-end services, creating an MVP, and having fun! The perseverance that was shown while we were debugging into the night and parsing messy documentation was nothing short of impressive and no matter what comes next for Things2Do, we will be sure to walk away proud of our achievements.

## What we learned
We can definitively say that we learned everything that we set out to learn during this project at DeltaHacks IX.
- Integrate front-end and back-end
- Learn new languages, libraries, frameworks, or services
- Include a sponsor challenge and design for a challenge them
- Time management and teamwork
- Web3 concepts and application of technology

## Things to Do
The working prototype that we created is a small segment of everything that we would want in an app like this but there are many more features that could be implemented.
- Multi-user voting feature using WebSockets
- Extending categories of hangouts
- Custom restaurant recommendations from attendees
- Ability to have a vote of "no confidence"
- Send out invites through a variety of social media platforms and calendars
- Scheduling features for days and times of day
- Incorporate hours of operation of venues

![image](https://user-images.githubusercontent.com/46271636/212544238-73c8032c-66fe-40a3-a294-8a754161f42d.png)

![image](https://user-images.githubusercontent.com/46271636/212544261-2ec3318d-44dd-4ccf-b1c6-74583a6d6b2c.png)

![image](https://user-images.githubusercontent.com/46271636/212552274-7370af77-121c-4c53-8e4a-a519dd698df3.png)