# app.py

from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        print("Form submitted")  # Debug statement
        # Collect common data
        prompt_name = request.form.get('prompt_name', '')
        work_type = request.form.get('work_type', '')
        user_inputs = {'prompt_name': prompt_name, 'work_type': work_type}
        
        if work_type == 'Fiction':
            # Collect fiction-specific data
            genre = request.form.get('genre', '')
            subgenres = request.form.getlist('subgenres[]')
            narrative_perspective = request.form.get('narrative_perspective', '')
            themes = request.form.getlist('themes[]')
            tone = request.form.get('tone', '')
            writing_style = request.form.get('writing_style', '')
            setting = request.form.get('setting', '')
            characters = request.form.get('characters', '')
            plot_overview = request.form.get('plot_overview', '')
            length = request.form.get('length', '')
            additional_notes = request.form.get('additional_notes', '')
            
            user_inputs.update({
                'genre': genre,
                'subgenres': subgenres,
                'narrative_perspective': narrative_perspective,
                'themes': themes,
                'tone': tone,
                'writing_style': writing_style,
                'setting': setting,
                'characters': characters,
                'plot_overview': plot_overview,
                'length': length,
                'additional_notes': additional_notes
            })
            
            # Generate prompt
            final_prompt = generate_fiction_prompt(user_inputs)
        
        elif work_type == 'Non-Fiction':
            # Collect non-fiction-specific data
            subject_matter = request.form.get('subject_matter', '')
            purpose = request.form.get('purpose', '')
            audience = request.form.getlist('audience[]')
            tone = request.form.get('tone', '')
            writing_style = request.form.get('writing_style', '')
            length = request.form.get('length', '')
            additional_notes = request.form.get('additional_notes', '')
            
            user_inputs.update({
                'subject_matter': subject_matter,
                'purpose': purpose,
                'audience': audience,
                'tone': tone,
                'writing_style': writing_style,
                'length': length,
                'additional_notes': additional_notes
            })
            
            # Generate prompt
            final_prompt = generate_nonfiction_prompt(user_inputs)
        
        else:
            final_prompt = "Invalid work type selected."
        
        return render_template('result.html', final_prompt=final_prompt)
    
    else:
        return render_template('index.html')

def generate_fiction_prompt(inputs):
    """
    Generates a prompt for fiction works based on user inputs.
    """
    # Extract data from inputs
    genre = inputs.get('genre', 'a genre')
    subgenres = ', '.join(inputs.get('subgenres', [])) or 'various subgenres'
    narrative_perspective = inputs.get('narrative_perspective', 'a perspective')
    themes = ', '.join(inputs.get('themes', [])) or 'various themes'
    tone = inputs.get('tone', 'a tone')
    writing_style = inputs.get('writing_style', 'a style')
    setting = inputs.get('setting', 'an unspecified setting')
    characters = inputs.get('characters', 'unspecified characters')
    plot_overview = inputs.get('plot_overview', 'no plot overview provided')
    length = inputs.get('length', 'an unspecified length')
    additional_notes = inputs.get('additional_notes', 'No additional notes.')
    
    # Build the prompt
    prompt = f"""
What: Help me create a fictional story.

Generate a {length} {genre} story{f' ({subgenres})' if subgenres != 'various subgenres' else ''} written from {narrative_perspective} perspective. The story should explore themes such as {themes} and have a {tone} tone. The writing style should be {writing_style}.

The setting is {setting}. Main characters include {characters}. Here's a brief plot overview: {plot_overview}.

Additional notes: {additional_notes}

Ensure the story is original and does not violate any copyright laws.
"""
    return prompt.strip()

def generate_nonfiction_prompt(inputs):
    """
    Generates a prompt for non-fiction works based on user inputs.
    """
    # Extract data from inputs
    subject_matter = inputs.get('subject_matter', 'an unspecified subject')
    purpose = inputs.get('purpose', 'an unspecified purpose')
    audience = ', '.join(inputs.get('audience', [])) or 'a general audience'
    tone = inputs.get('tone', 'a tone')
    writing_style = inputs.get('writing_style', 'a style')
    length = inputs.get('length', 'an unspecified length')
    additional_notes = inputs.get('additional_notes', 'No additional notes.')
    
    # Build the prompt
    prompt = f"""
What: Help me create a non-fiction piece.

Generate a {length} non-fiction work about {subject_matter}. The purpose is {purpose}. The target audience is {audience}. The tone should be {tone}, and the writing style should be {writing_style}.

Additional notes: {additional_notes}

Ensure the content is accurate, well-researched, and does not violate any copyright.
"""
    return prompt.strip()

if __name__ == '__main__':
    app.run(debug=True)
